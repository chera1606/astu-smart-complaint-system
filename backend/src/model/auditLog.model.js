import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Can be null for failed login attempts
    },
    action: {
        type: String,
        required: true,
        enum: [
            'login_success', 
            'login_failure', 
            'logout', 
            'create_complaint', 
            'update_complaint_status', 
            'add_remark',
            'delete_complaint',
            'unauthorized_access_attempt'
        ]
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { timestamps: true });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
