import Notification from '../../model/notification.model.js';

export const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        if (notification.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        notification.read = true;
        await notification.save();
        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const clearAll = async (req, res) => {
    try {
        await Notification.deleteMany({ recipient: req.user._id });
        res.json({ message: 'All notifications cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createInternalNotification = async (recipient, title, message, link, type) => {
    try {
        const notification = new Notification({
            recipient,
            title,
            message,
            link,
            type
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Failed to create notification:', error);
    }
};
