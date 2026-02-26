import Complaint from '../../model/complaint.model.js';
import User from '../../model/user.model.js';
import generateId from '../../utils/idGenerator.js';
import { createInternalNotification } from '../notification/notification.controller.js';
import { sendStatusUpdateEmail, sendRemarkEmail } from '../../utils/emailService.js';

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private/Student
export const createComplaint = async (req, res) => {
    try {
        const { departmentId, title, description, category, priority, location } = req.body;

        if (!departmentId || !title || !description || !category || !location) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const trackingId = await generateId('CMP', Complaint, 'trackingId');

        const complaint = new Complaint({
            trackingId,
            studentId: req.user._id,
            departmentId,
            title,
            description,
            category,
            priority: priority || 'Medium',
            location,
            attachments: req.file ? [`/uploads/${req.file.filename}`] : []
        });

        const createdComplaint = await complaint.save();

        // Notify Admins and Department Staff
        const admins = await User.find({ role: 'admin' });
        const staff = await User.find({ role: 'staff', departmentId });

        const notificationPromises = [
            ...admins.map(admin => createInternalNotification(
                admin._id,
                'New Complaint Submitted',
                `A new complaint #${trackingId} has been submitted in ${category}.`,
                `/admin/complaints`,
                'new_complaint'
            )),
            ...staff.map(s => createInternalNotification(
                s._id,
                'New Assigned Complaint',
                `A new complaint #${trackingId} has been assigned to your department.`,
                `/staff/complaints`,
                'new_complaint'
            ))
        ];
        await Promise.all(notificationPromises);

        res.status(201).json(createdComplaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student's own complaints
// @route   GET /api/complaints/student
// @access  Private/Student
export const getStudentComplaints = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                $or: [
                    { title: { $regex: req.query.keyword, $options: 'i' } },
                    { description: { $regex: req.query.keyword, $options: 'i' } },
                    { category: { $regex: req.query.keyword, $options: 'i' } }
                ]
            }
            : {};

        const statusFilter = req.query.status ? { status: req.query.status } : {};

        const complaints = await Complaint.find({ studentId: req.user._id, ...keyword, ...statusFilter })
            .populate('departmentId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get department complaints
// @route   GET /api/complaints/department
// @access  Private/Staff
export const getDepartmentComplaints = async (req, res) => {
    try {
        // Staff should only see complaints for their department
        const keyword = req.query.keyword
            ? {
                $or: [
                    { title: { $regex: req.query.keyword, $options: 'i' } },
                    { category: { $regex: req.query.keyword, $options: 'i' } }
                ]
            }
            : {};

        const statusFilter = req.query.status ? { status: req.query.status } : {};

        const complaints = await Complaint.find({ departmentId: req.user.departmentId, ...keyword, ...statusFilter })
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all complaints
// @route   GET /api/complaints/all
// @access  Private/Admin
export const getAllComplaints = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                $or: [
                    { title: { $regex: req.query.keyword, $options: 'i' } },
                    { category: { $regex: req.query.keyword, $options: 'i' } }
                ]
            }
            : {};

        const statusFilter = req.query.status ? { status: req.query.status } : {};
        const departmentFilter = req.query.departmentId ? { departmentId: req.query.departmentId } : {};


        const complaints = await Complaint.find({ ...keyword, ...statusFilter, ...departmentFilter })
            .populate('studentId', 'name email')
            .populate('departmentId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
export const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('studentId', 'name email')
            .populate('departmentId', 'name')
            .populate('remarks.staffId', 'name role');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Authorization checks
        if (req.user.role === 'student' && complaint.studentId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this complaint' });
        }

        if (req.user.role === 'staff' && complaint.departmentId._id.toString() !== req.user.departmentId.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this complaint' });
        }

        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update complaint status and add remark
// @route   PUT /api/complaints/:id/status
// @access  Private/Staff/Admin
export const updateComplaintStatus = async (req, res) => {
    try {
        const { status, remark } = req.body;

        const complaint = await Complaint.findById(req.params.id).populate('studentId', 'email name');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Authorization checks
        if (req.user.role === 'staff' && complaint.departmentId.toString() !== req.user.departmentId.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this complaint' });
        }

        if (status) {
            complaint.status = status;
        }

        if (remark) {
            complaint.remarks.push({
                staffId: req.user._id,
                message: remark
            });
        }

        const updatedComplaint = await complaint.save();

        // Create Notification and Send Email
        if (status || remark) {
            const title = status ? `Complaint Status Updated` : `New Remark on Complaint`;
            const message = status
                ? `Your complaint #${complaint.trackingId} status has been updated to ${status}.`
                : `A staff member added a remark to your complaint #${complaint.trackingId}.`;

            await createInternalNotification(
                complaint.studentId._id,
                title,
                message,
                `/student/my-complaints`,
                status ? 'complaint_status' : 'remark_added'
            );

            // Send Email
            if (complaint.studentId?.email) {
                if (status) {
                    await sendStatusUpdateEmail(complaint.studentId.email, complaint.trackingId, status);
                } else if (remark) {
                    await sendRemarkEmail(complaint.studentId.email, complaint.trackingId);
                }
            }

            // Notify Admin if updated by Staff, or Staff if updated by Admin
            if (req.user.role === 'staff') {
                const admins = await User.find({ role: 'admin' });
                await Promise.all(admins.map(admin => createInternalNotification(
                    admin._id,
                    `Complaint ${status ? 'Updated' : 'Remarked'} by Staff`,
                    `Staff member ${req.user.name} ${status ? `updated status to ${status}` : 'added a remark'} for #${complaint.trackingId}.`,
                    `/admin/complaints`,
                    'complaint_update'
                )));
            } else if (req.user.role === 'admin') {
                const staff = await User.find({ role: 'staff', departmentId: complaint.departmentId });
                await Promise.all(staff.map(s => createInternalNotification(
                    s._id,
                    `Complaint ${status ? 'Updated' : 'Remarked'} by Admin`,
                    `Administrator ${req.user.name} ${status ? `updated status to ${status}` : 'added a remark'} for #${complaint.trackingId}.`,
                    `/staff/complaints`,
                    'complaint_update'
                )));
            }
        }

        res.status(200).json(updatedComplaint);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get analytics (admin only)
// @route   GET /api/complaints/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
    try {
        const totalComplaints = await Complaint.countDocuments();
        const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
        const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });

        // Aggregate by category
        const byCategory = await Complaint.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // Aggregate by department
        const byDepartment = await Complaint.aggregate([
            { $group: { _id: "$departmentId", count: { $sum: 1 } } },
            { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'department' } },
            { $unwind: '$department' },
            { $project: { departmentName: '$department.name', count: 1 } }
        ]);

        res.status(200).json({
            totalComplaints,
            pendingComplaints,
            resolvedComplaints,
            resolutionRate: totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(2) : 0,
            byCategory,
            byDepartment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
