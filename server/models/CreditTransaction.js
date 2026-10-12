/**
 * models/CreditTransaction.js
 * 
 * Purpose: Immutable ledger of student skill credits.
 * Tracks initial welcome bonus, session teaching earnings, and redemptions.
 */

const mongoose = require('mongoose');

const creditTransactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  }, // e.g. +10, +5, -5
  type: { 
    type: String, 
    enum: ['initial_bonus', 'session_teaching_reward', 'session_booking', 'admin_adjustment'], 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  referenceSessionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Session' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.models.CreditTransaction || mongoose.model('CreditTransaction', creditTransactionSchema);
