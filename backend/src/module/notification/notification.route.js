import express from 'express';
import { getMyNotifications, markAsRead, clearAll } from './notification.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getMyNotifications)
    .delete(protect, clearAll);

router.route('/:id/read')
    .put(protect, markAsRead);

export default router;
