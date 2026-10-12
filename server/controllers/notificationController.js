/**
 * controllers/notificationController.js
 * 
 * Purpose: Manages In-App Student Notifications.
 * Delivers alerts for session invitations, acceptances, reviews, and credits.
 */

const { Notification } = require('../models');

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id).toString();
    const notifications = await Notification.find({ userId });

    // Sort newest first
    const sorted = notifications.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const unreadCount = sorted.filter(n => !n.isRead).length;

    res.status(200).json({
      success: true,
      unreadCount,
      notifications: sorted
    });
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve notifications.' });
  }
};

// @desc    Mark all user notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id).toString();
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (err) {
    console.error('Mark read notifications error:', err);
    res.status(500).json({ success: false, message: 'Failed to update notifications.' });
  }
};

module.exports = {
  getNotifications,
  markAllAsRead
};
