import AuditLog from "../model/auditLog.model.js";

/**
 * Middleware/Utility to log system actions
 * @param {String} action - The action being performed
 * @param {Object} req - Express request object
 * @param {Object} metadata - Additional info to log
 */
export const logAction = async (action, req, metadata = {}) => {
    try {
        const userId = req.user ? req.user._id : null;
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        await AuditLog.create({
            userId,
            action,
            ipAddress,
            userAgent: req.headers['user-agent'],
            metadata
        });
    } catch (error) {
        console.error("Audit Logging Error:", error);
    }
};

// Middleware version for simple route logging
export const auditLogger = (action) => {
    return async (req, res, next) => {
        // We log after the response is finished to ensure the action was actually attempted
        res.on('finish', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                logAction(action, req);
            }
        });
        next();
    };
};
