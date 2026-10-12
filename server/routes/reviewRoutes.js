/**
 * routes/reviewRoutes.js
 * 
 * Endpoints for ratings and feedback.
 */

const express = require('express');
const router = express.Router();
const { createReview, getStudentReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/student/:id', protect, getStudentReviews);

module.exports = router;
