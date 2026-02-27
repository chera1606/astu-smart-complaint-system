import AuditLog from '../../model/auditLog.model.js';

// @desc    Get all audit logs
// @route   GET /api/audit-logs
// @access  Private/Admin
export const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate('userId', 'name email role')
            .sort({ createdAt: -1 })
            .limit(500); // Limit to recent 500 for performance

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
