/**
 * controllers/matchController.js
 * 
 * Purpose: Handles Skill Matching & Student Discovery.
 * Exposes endpoints for finding mutual skill matches and exploring peer mentors.
 */

const { User } = require('../models');
const { calculateMatches } = require('../services/matchService');

// @desc    Get mutual and one-way skill matches for current student
// @route   GET /api/matches
// @access  Private
const getMatches = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const currentUser = await User.findById(userId);

    // Fetch all other active students
    const allUsers = await User.find({ role: 'student' });

    const filters = {
      skillName: req.query.skill,
      category: req.query.category,
      proficiency: req.query.proficiency
    };

    const matches = calculateMatches(currentUser, allUsers, filters);

    res.status(200).json({
      success: true,
      count: matches.length,
      mutualCount: matches.filter(m => m.matchType === 'mutual').length,
      matches
    });
  } catch (err) {
    console.error('Skill matching error:', err);
    res.status(500).json({ success: false, message: 'Failed to calculate matches.' });
  }
};

// @desc    Discover and browse registered students with filtering
// @route   GET /api/matches/discover
// @access  Private
const discoverStudents = async (req, res) => {
  try {
    const currentUserId = req.user._id ? req.user._id.toString() : req.user.id.toString();
    const currentUser = await User.findById(currentUserId);
    const { search, department, category, proficiency, matchesWanted, page = 1, limit = 20 } = req.query;

    const allUsers = await User.find({ role: 'student', isActive: true });

    let filtered = allUsers.filter(u => {
      const uId = u._id ? u._id.toString() : u.id.toString();
      return uId !== currentUserId;
    });

    if (department && department !== 'All') {
      filtered = filtered.filter(u => u.department === department);
    }

    if (category && category !== 'All') {
      filtered = filtered.filter(u => 
        (u.skillsTeachable || []).some(s => s.category === category)
      );
    }

    if (proficiency && proficiency !== 'All') {
      filtered = filtered.filter(u => 
        (u.skillsTeachable || []).some(s => s.proficiency === proficiency)
      );
    }

    if (matchesWanted === 'true' && currentUser && currentUser.skillsWanted) {
      const wantedNames = (currentUser.skillsWanted || []).map(w => (w.name || '').trim().toLowerCase());
      filtered = filtered.filter(u => 
        (u.skillsTeachable || []).some(t => wantedNames.includes((t.name || '').trim().toLowerCase()))
      );
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(u => {
        const nameMatch = (u.name || '').toLowerCase().includes(q);
        const deptMatch = (u.department || '').toLowerCase().includes(q);
        const collegeMatch = (u.college || '').toLowerCase().includes(q);
        const teachMatch = (u.skillsTeachable || []).some(s => (s.name || '').toLowerCase().includes(q));
        const wantMatch = (u.skillsWanted || []).some(s => (s.name || '').toLowerCase().includes(q));
        return nameMatch || deptMatch || collegeMatch || teachMatch || wantMatch;
      });
    }

    const totalCount = filtered.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(startIndex, startIndex + limitNum);

    // Map safe public response
    const students = paginated.map(u => ({
      _id: u._id || u.id,
      name: u.name,
      picture: u.picture || '',
      college: u.college || 'College of Engineering & Technology',
      department: u.department,
      yearOfStudy: u.yearOfStudy,
      bio: u.bio,
      averageRating: u.averageRating || 5.0,
      reviewCount: u.reviewCount || 0,
      totalSessionsCompleted: u.totalSessionsCompleted || 0,
      skillsTeachable: u.skillsTeachable || [],
      skillsWanted: u.skillsWanted || []
    }));

    res.status(200).json({
      success: true,
      count: students.length,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      students
    });
  } catch (err) {
    console.error('Discover students error:', err);
    res.status(500).json({ success: false, message: 'Failed to discover students.' });
  }
};

module.exports = {
  getMatches,
  discoverStudents
};
