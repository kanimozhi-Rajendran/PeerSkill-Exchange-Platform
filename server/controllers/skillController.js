/**
 * controllers/skillController.js
 * 
 * Purpose: Manages a Student's Teachable and Wanted Skills.
 * Supports adding, editing, and deleting skills with category and proficiency levels.
 */

const crypto = require('crypto');
const { User } = require('../models');

// Valid skill categories
const VALID_CATEGORIES = [
  'Programming', 'Data Science', 'Design', 'Languages', 'Engineering', 'Academics', 'Music & Arts', 'Other'
];

const VALID_PROFICIENCIES = ['Beginner', 'Intermediate', 'Advanced'];

// @desc    Add a new skill (teachable or wanted)
// @route   POST /api/skills
// @access  Private
const addSkill = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { type, name, category, proficiency, description } = req.body;

    if (!type || !name) {
      return res.status(400).json({
        success: false,
        message: 'Skill type ("teachable" or "wanted") and skill name are required.'
      });
    }

    if (type !== 'teachable' && type !== 'wanted') {
      return res.status(400).json({
        success: false,
        message: 'Skill type must be either "teachable" or "wanted".'
      });
    }

    const field = type === 'teachable' ? 'skillsTeachable' : 'skillsWanted';
    const user = await User.findById(userId);

    const existingList = user[field] || [];

    // Check duplicate skill name in same list
    const isDuplicate = existingList.some(
      s => s.name.trim().toLowerCase() === name.trim().toLowerCase()
    );

    if (isDuplicate) {
      return res.status(400).json({
        success: false,
        message: `You have already added "${name}" to your ${type} skills list.`
      });
    }

    const newSkill = {
      id: crypto.randomBytes(8).toString('hex'),
      name: name.trim(),
      category: VALID_CATEGORIES.includes(category) ? category : 'Programming',
      proficiency: VALID_PROFICIENCIES.includes(proficiency) ? proficiency : 'Intermediate',
      description: description ? description.trim() : '',
      addedAt: new Date().toISOString()
    };

    const updatedList = [...existingList, newSkill];
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { [field]: updatedList },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: `Skill "${name}" added to ${type} skills!`,
      skillsTeachable: updatedUser.skillsTeachable,
      skillsWanted: updatedUser.skillsWanted
    });
  } catch (err) {
    console.error('Add skill error:', err);
    res.status(500).json({ success: false, message: 'Failed to add skill.' });
  }
};

// @desc    Update an existing skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const skillId = req.params.id;
    const { type, name, category, proficiency, description } = req.body;

    if (!type || (type !== 'teachable' && type !== 'wanted')) {
      return res.status(400).json({
        success: false,
        message: 'Valid skill type ("teachable" or "wanted") is required.'
      });
    }

    const field = type === 'teachable' ? 'skillsTeachable' : 'skillsWanted';
    const user = await User.findById(userId);
    const list = user[field] || [];

    const index = list.findIndex(s => (s.id === skillId || s._id === skillId));
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found in your list.'
      });
    }

    list[index] = {
      ...list[index],
      name: name ? name.trim() : list[index].name,
      category: VALID_CATEGORIES.includes(category) ? category : list[index].category,
      proficiency: VALID_PROFICIENCIES.includes(proficiency) ? proficiency : list[index].proficiency,
      description: typeof description === 'string' ? description.trim() : list[index].description
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { [field]: list },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully.',
      skillsTeachable: updatedUser.skillsTeachable,
      skillsWanted: updatedUser.skillsWanted
    });
  } catch (err) {
    console.error('Update skill error:', err);
    res.status(500).json({ success: false, message: 'Failed to update skill.' });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const skillId = req.params.id;
    const { type } = req.query;

    if (!type || (type !== 'teachable' && type !== 'wanted')) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter ?type=teachable or ?type=wanted is required.'
      });
    }

    const field = type === 'teachable' ? 'skillsTeachable' : 'skillsWanted';
    const user = await User.findById(userId);
    const list = user[field] || [];

    const filtered = list.filter(s => s.id !== skillId && s._id !== skillId);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { [field]: filtered },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Skill removed successfully.',
      skillsTeachable: updatedUser.skillsTeachable,
      skillsWanted: updatedUser.skillsWanted
    });
  } catch (err) {
    console.error('Delete skill error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete skill.' });
  }
};

module.exports = {
  addSkill,
  updateSkill,
  deleteSkill
};
