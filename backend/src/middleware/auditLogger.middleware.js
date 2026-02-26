import AuditLog from "../model/auditLog.model.js";

/**
 * Middleware/Utility to log system actions
 * @param {String} action - The action being performed
 * @param {Object} req - Express request object
 * @param {Object} metadata - Additional info to log
 */
export const logAction = async (action, req, metadata = {}) => {
    try {
        if (!req) return;
        
        const userId = req.user ? req.user._id : null;
        
        // Robust IP extraction
        const ipAddress = 
            req.ip || 
            (req.headers && req.headers['x-forwarded-for']) || 
            (req.connection && req.connection.remoteAddress) || 
            (req.socket && req.socket.remoteAddress) ||
            '127.0.0.1';

        const userAgent = req.headers ? req.headers['user-agent'] : 'Unknown';

        await AuditLog.create({
            userId,
            action,
            ipAddress,
            userAgent,
            metadata
        });
    } catch (error) {
        console.error("DEBUG: Audit Logging Error:", error.message);
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
