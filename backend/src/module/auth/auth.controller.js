import User from '../../model/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import generateId, { generateUgr, generateStaffId, generateAdminId } from '../../utils/idGenerator.js';
import { logAction } from '../../middleware/auditLogger.middleware.js';
import sendEmail from '../../utils/sendEmail.js';

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

export const registerUser = async (req, res) => {
    try {
        let { name, email, password, role, departmentId, ugrNumber, dormBlock } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Role-specific ID generation logic and ugrNumber logic
        let userId;
        if (role === 'staff') {
            userId = await generateStaffId(User);
        } else if (role === 'admin') {
            userId = await generateAdminId(User);
        } else {
            // Student: Check if ugrNumber is provided, otherwise generate it
            if (!ugrNumber) {
                ugrNumber = await generateUgr(User);
            }
            // For students, their University ID (userId) IS their UGR number
            userId = ugrNumber;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Build user data
        const userData = {
            userId,
            name,
            email,
            password: hashedPassword,
            role: role || 'student',
            ugrNumber: role === 'staff' || role === 'admin' ? null : ugrNumber
        };

        if (dormBlock) userData.dormBlock = dormBlock;
        if (departmentId) userData.departmentId = departmentId;


        const user = await User.create(userData);

        if (user) {
            const token = generateToken(user._id);
            res.status(201).json({
                _id: user.id,
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
                departmentId: user.departmentId,
                ugrNumber: user.ugrNumber,
                dormBlock: user.dormBlock,
                token,
            });

            // Audit Log
            await logAction('login_success', { user, ip: req.ip, headers: req.headers }, { method: 'registration' });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { userId, password } = req.body;

        if (!userId || !password) {
            return res.status(400).json({ message: 'Please provide ID and password' });
        }

        // Check for user by userId
        const user = await User.findOne({ userId });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user._id);
            res.json({
                _id: user.id,
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
                departmentId: user.departmentId,
                token,
            });

            // Audit Log
            await logAction('login_success', { user, ip: req.ip, headers: req.headers });
        } else {
            // Audit Log Failure
            await logAction('login_failure', { ip: req.ip, headers: req.headers }, { attemptedUserId: userId });
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('departmentId', 'name');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'There is no user with that email' });
        }

        // Get reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire (10 minutes)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Create reset url
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        // DEV MODE: Print reset link to console
        console.log('--------------------------------------------');
        console.log('PASSWORD RESET LINK (DEV MODE):');
        console.log(resetUrl);
        console.log('--------------------------------------------');

        const message = `
            <h2>You have requested a password reset</h2>
            <p>Please go to this link to reset your password:</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
            <p>This link is only valid for 10 minutes.</p>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                html: message,
            });

            res.status(200).json({ message: 'Email sent' });
            
            // Audit Log
            await logAction('forgot_password_email_sent', { user, ip: req.ip, headers: req.headers });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            message: 'Password reset successful',
            token: generateToken(user._id),
        });

        // Audit Log
        await logAction('password_reset_success', { user, ip: req.ip, headers: req.headers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
