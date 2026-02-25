import User from '../../model/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import generateId, { generateUgr } from '../../utils/idGenerator.js';

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

        // Automatic UGR generation if missing for students/staff
        if (!ugrNumber && (role === 'student' || role === 'staff' || !role)) {
            ugrNumber = await generateUgr(User);
        }

        // Validate UGR for students (and staff if generated)
        if (ugrNumber) {
            const ugrExists = await User.findOne({ ugrNumber });
            if (ugrExists) {
                // If collision on auto-gen (unlikely with new logic), try one more time or error
                if (!req.body.ugrNumber) {
                    ugrNumber = await generateUgr(User); // retry
                } else {
                    return res.status(400).json({ message: 'UGR Number already in use' });
                }
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate unique User ID
        const userId = await generateId('USR-', User);

        // Build user data
        const userData = {
            userId,
            name,
            email,
            password: hashedPassword,
            role: role || 'student',
            ugrNumber
        };

        if (dormBlock) userData.dormBlock = dormBlock;
        if (departmentId) userData.departmentId = departmentId;


        const user = await User.create(userData);

        if (user) {
            res.status(201).json({
                _id: user.id,
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
                departmentId: user.departmentId,
                ugrNumber: user.ugrNumber,
                dormBlock: user.dormBlock,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
                departmentId: user.departmentId,
                token: generateToken(user._id),
            });
        } else {
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
