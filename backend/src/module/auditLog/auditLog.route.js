import express from 'express';
import { getAuditLogs } from './auditLog.controller.js';
import { protect, admin } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, getAuditLogs);

export default router;
