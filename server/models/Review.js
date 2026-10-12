/**
 * models/Review.js
 * 
 * Purpose: Defines Peer Review and Rating Schema.
 * Enforces rating bounds (1-5), links to completed sessions,
 * and ensures uniqueness per participant pair per session.
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  sessionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Session', 
    required: true 
  },
  reviewerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  revieweeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    required: true, 
    trim: true,
    minlength: 3 
  },
  skillName: { 
    type: String, 
    default: '' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Enforce single review per reviewer per session
reviewSchema.index({ sessionId: 1, reviewerId: 1 }, { unique: true });

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);
