/**
 * controllers/reviewController.js
 * 
 * Purpose: Handles Peer Ratings and Reviews.
 * Enforces key SEPM integrity rules:
 * 1. Only participants of COMPLETED sessions can post reviews.
 * 2. Strict prevention of duplicate reviews.
 * 3. Rating restricted between 1 and 5 stars.
 * 4. Automatically re-computes reviewee's average rating and count.
 */

const { Review, Session, User, Notification } = require('../models');

// @desc    Submit a review for a completed session
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const reviewerId = (req.user._id || req.user.id).toString();
    const { sessionId, rating, comment } = req.body;

    if (!sessionId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Session ID, numeric rating (1-5), and feedback comment are required.'
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5.'
      });
    }

    // Verify session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted for completed sessions.'
      });
    }

    const tId = session.teacherId.toString();
    const lId = session.learnerId.toString();

    // Verify reviewer is a participant
    if (reviewerId !== tId && reviewerId !== lId) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant of this session.'
      });
    }

    // Determine reviewee (if reviewer is learner -> reviewee is teacher, and vice versa)
    const revieweeId = reviewerId === lId ? tId : lId;

    // Check duplicate review
    const existing = await Review.findOne({
      sessionId,
      reviewerId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this session.'
      });
    }

    const newReview = await Review.create({
      sessionId,
      reviewerId,
      revieweeId,
      rating: numRating,
      comment: comment.trim(),
      skillName: session.skillName
    });

    // Re-calculate reviewee average rating
    const allReviewsForReviewee = await Review.find({ revieweeId });
    const totalRating = allReviewsForReviewee.reduce((sum, r) => sum + Number(r.rating), 0);
    const count = allReviewsForReviewee.length;
    const avg = count > 0 ? (totalRating / count).toFixed(1) : 5.0;

    await User.findByIdAndUpdate(revieweeId, {
      averageRating: Number(avg),
      reviewCount: count
    });

    // Notify reviewee
    await Notification.create({
      userId: revieweeId,
      title: 'New Review Received ⭐',
      message: `${req.user.name} rated you ${numRating}/5 for session "${session.skillName}": "${comment.trim()}"`,
      type: 'review_received',
      link: '/profile'
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. Thank you for your feedback!',
      review: newReview
    });
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
};

// @desc    Get reviews for a student profile
// @route   GET /api/reviews/student/:id
// @access  Private
const getStudentReviews = async (req, res) => {
  try {
    const studentId = req.params.id;
    const reviews = await Review.find({ revieweeId: studentId });

    // Populate reviewer names
    const allUsers = await User.find({});
    const userMap = {};
    allUsers.forEach(u => {
      userMap[(u._id || u.id).toString()] = u.name;
    });

    const populated = reviews.map(r => ({
      ...r,
      reviewerName: userMap[r.reviewerId ? r.reviewerId.toString() : ''] || 'Student Peer'
    }));

    res.status(200).json({
      success: true,
      count: populated.length,
      reviews: populated
    });
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve reviews.' });
  }
};

module.exports = {
  createReview,
  getStudentReviews
};
