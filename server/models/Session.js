/**
 * models/Session.js
 * 
 * Purpose: Defines Peer Learning Session Schema.
 * Tracks teaching & learning participants, skill details, status lifecycle,
 * and completion credits.
 */

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  learnerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  skillName: { type: String, required: true, trim: true },
  skillCategory: { type: String, default: 'Programming' },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:mm format
  durationMinutes: { type: Number, default: 60 },
  message: { type: String, default: '' },
  meetingLink: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'], 
    default: 'pending' 
  },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cancellationReason: { type: String, default: '' },
  creditsAwarded: { type: Boolean, default: false },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.models.Session || mongoose.model('Session', sessionSchema);
