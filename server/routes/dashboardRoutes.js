/**
 * routes/dashboardRoutes.js
 * 
 * Endpoints for student dashboard metrics and learning activity.
 */

const express = require('express');
const router = express.Router();
const { getDashboardStats, getLearningProgress } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getDashboardStats);
router.get('/progress', protect, getLearningProgress);

module.exports = router;
