/**
 * routes/matchRoutes.js
 * 
 * Endpoints for skill matching algorithm and student exploration.
 */

const express = require('express');
const router = express.Router();
const { getMatches, discoverStudents } = require('../controllers/matchController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMatches);
router.get('/discover', protect, discoverStudents);

module.exports = router;
