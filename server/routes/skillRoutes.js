/**
 * routes/skillRoutes.js
 * 
 * Endpoints for managing student teachable and wanted skills.
 */

const express = require('express');
const router = express.Router();
const { addSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addSkill);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
