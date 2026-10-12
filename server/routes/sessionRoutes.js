/**
 * routes/sessionRoutes.js
 * 
 * Endpoints for peer learning session lifecycle.
 */

const express = require('express');
const router = express.Router();
const {
  createSession,
  getMySessions,
  acceptSession,
  rejectSession,
  cancelSession,
  completeSession
} = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createSession);
router.get('/', protect, getMySessions);
router.put('/:id/accept', protect, acceptSession);
router.put('/:id/reject', protect, rejectSession);
router.put('/:id/cancel', protect, cancelSession);
router.put('/:id/complete', protect, completeSession);

module.exports = router;
