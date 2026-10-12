/**
 * controllers/adminController.js
 * 
 * Purpose: Platform Administration & Student Moderation.
 * Restricted to users with role === 'admin'.
 * Provides high-level governance, user status toggles, and audit visibility.
 */

const { User, Session, Review, CreditTransaction } = require('../models');

// @desc    Get system-wide platform metrics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res) => {
  try {
    const allUsers = await User.find({});
    const students = allUsers.filter(u => u.role === 'student');
    const activeStudents = students.filter(u => u.isActive !== false);

    const allSessions = await Session.find({});
    const completedSessions = allSessions.filter(s => s.status === 'completed');
    const pendingSessions = allSessions.filter(s => s.status === 'pending');
    const acceptedSessions = allSessions.filter(s => s.status === 'accepted');

    const allReviews = await Review.find({});
    const allTransactions = await CreditTransaction.find({});

    // Count distinct skills across users
    const allSkills = new Set();
    students.forEach(s => {
      (s.skillsTeachable || []).forEach(sk => allSkills.add(sk.name.toLowerCase()));
      (s.skillsWanted || []).forEach(sk => allSkills.add(sk.name.toLowerCase()));
    });

    res.status(200).json({
      success: true,
      stats: {
        totalStudents: students.length,
        activeStudents: activeStudents.length,
        suspendedStudents: students.length - activeStudents.length,
        totalSessions: allSessions.length,
        completedSessions: completedSessions.length,
        pendingSessions: pendingSessions.length,
        acceptedSessions: acceptedSessions.length,
        totalReviews: allReviews.length,
        distinctSkillsCount: allSkills.size,
        totalCreditTransactions: allTransactions.length
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve admin stats.' });
  }
};

// @desc    Get all users with moderation controls
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});

    const safeUsers = allUsers.map(u => {
      const copy = { ...u };
      delete copy.password;
      return copy;
    });

    res.status(200).json({
      success: true,
      count: safeUsers.length,
      users: safeUsers
    });
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
  }
};

// @desc    Toggle student active / suspended status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin only)
const toggleUserStatus = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const user = await User.findById(targetUserId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Administrator accounts cannot be deactivated.'
      });
    }

    const newStatus = user.isActive === false ? true : false;
    const updated = await User.findByIdAndUpdate(
      targetUserId,
      { isActive: newStatus },
      { new: true }
    );

    const safeUser = { ...updated };
    delete safeUser.password;

    res.status(200).json({
      success: true,
      message: `Student account has been ${newStatus ? 'activated' : 'suspended'}.`,
      user: safeUser
    });
  } catch (err) {
    console.error('Toggle status error:', err);
    res.status(500).json({ success: false, message: 'Failed to change student status.' });
  }
};

// @desc    Get all sessions for audit
// @route   GET /api/admin/sessions
// @access  Private (Admin only)
const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find({});
    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (err) {
    console.error('Get admin sessions error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve sessions.' });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  getAllSessions
};
