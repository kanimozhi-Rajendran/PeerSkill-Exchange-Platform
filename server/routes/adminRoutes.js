/**
 * routes/adminRoutes.js
 * 
 * Endpoints for platform administration and moderation.
 * Protected by both protect and requireAdmin middleware.
 */

const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  getAllSessions
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

router.use(protect);
router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/sessions', getAllSessions);

module.exports = router;
