/**
 * controllers/dashboardController.js
 * 
 * Purpose: Aggregates real-time statistics and learning progress metrics.
 * Powers student dashboard cards, analytics chart, and credit transaction ledger.
 */

const { User, Session, CreditTransaction } = require('../models');
const { calculateMatches } = require('../services/matchService');

// @desc    Get dashboard metrics for authenticated student
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id).toString();
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const skillsTeachableCount = (currentUser.skillsTeachable || []).length;
    const skillsWantedCount = (currentUser.skillsWanted || []).length;

    // Fetch candidate students to compute actual matches
    const allStudents = await User.find({ role: 'student' });
    const matches = calculateMatches(currentUser, allStudents);
    const mutualMatchesCount = matches.filter(m => m.matchType === 'mutual').length;

    // Fetch sessions
    const userSessions = await Session.find({
      $or: [
        { teacherId: userId },
        { learnerId: userId }
      ]
    });

    const upcomingSessions = userSessions.filter(s => s.status === 'accepted');
    const completedSessions = userSessions.filter(s => s.status === 'completed');
    const pendingSessions = userSessions.filter(s => s.status === 'pending');

    // Calculate hours taught and learned
    let minutesTaught = 0;
    let minutesLearned = 0;

    completedSessions.forEach(s => {
      const dur = Number(s.durationMinutes) || 60;
      if (s.teacherId && s.teacherId.toString() === userId) {
        minutesTaught += dur;
      }
      if (s.learnerId && s.learnerId.toString() === userId) {
        minutesLearned += dur;
      }
    });

    // Credit history
    const transactions = await CreditTransaction.find({ userId });

    // Populate names for recent activities
    const userMap = {};
    allStudents.forEach(u => {
      userMap[(u._id || u.id).toString()] = u.name;
    });

    const populatedRecent = userSessions.slice(-5).reverse().map(s => {
      const isTeacher = s.teacherId && s.teacherId.toString() === userId;
      const partnerId = isTeacher ? s.learnerId : s.teacherId;
      const partnerName = partnerId ? userMap[partnerId.toString()] || 'Peer Student' : 'Peer Student';
      return {
        ...s,
        partnerName,
        role: isTeacher ? 'Teaching' : 'Learning'
      };
    });

    res.status(200).json({
      success: true,
      stats: {
        skillsTeachableCount,
        skillsWantedCount,
        matchesCount: matches.length,
        mutualMatchesCount,
        upcomingCount: upcomingSessions.length,
        completedCount: completedSessions.length,
        pendingCount: pendingSessions.length,
        credits: currentUser.credits || 0,
        averageRating: currentUser.averageRating || 5.0,
        reviewCount: currentUser.reviewCount || 0,
        hoursTaught: (minutesTaught / 60).toFixed(1),
        hoursLearned: (minutesLearned / 60).toFixed(1),
        totalExchangeHours: ((minutesTaught + minutesLearned) / 60).toFixed(1)
      },
      recentSessions: populatedRecent,
      transactions: transactions.slice(-10).reverse()
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve dashboard statistics.' });
  }
};

// @desc    Get detailed learning progress for charts
// @route   GET /api/dashboard/progress
// @access  Private
const getLearningProgress = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id).toString();
    const completedSessions = await Session.find({
      $or: [{ teacherId: userId }, { learnerId: userId }],
      status: 'completed'
    });

    // Group hours by month/week for charts
    const monthlyMap = {};
    completedSessions.forEach(s => {
      const date = new Date(s.date || s.createdAt);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      const durHours = (Number(s.durationMinutes) || 60) / 60;

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthKey, taught: 0, learned: 0 };
      }

      if (s.teacherId && s.teacherId.toString() === userId) {
        monthlyMap[monthKey].taught += durHours;
      } else {
        monthlyMap[monthKey].learned += durHours;
      }
    });

    const chartData = Object.values(monthlyMap);
    if (chartData.length === 0) {
      // Default initial mock points for new students to show empty baseline
      chartData.push({ month: 'Start', taught: 0, learned: 0 });
    }

    res.status(200).json({
      success: true,
      chartData
    });
  } catch (err) {
    console.error('Progress error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve learning progress.' });
  }
};

module.exports = {
  getDashboardStats,
  getLearningProgress
};
