/**
 * models/Notification.js
 * 
 * Purpose: In-app notifications for students.
 * Alerts users on incoming booking requests, status changes, reviews, and credits.
 */

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['request_received', 'request_accepted', 'request_rejected', 'session_completed', 'session_cancelled', 'review_received', 'credits_earned', 'system'], 
    default: 'system' 
  },
  link: { 
    type: String, 
    default: '/sessions' 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
