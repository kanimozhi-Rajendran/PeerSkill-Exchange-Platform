/**
 * controllers/sessionController.js
 * 
 * Purpose: Manages Peer Learning Session Lifecycle.
 * Implements rigorous state transitions:
 * Pending -> Accepted / Rejected
 * Accepted -> Completed / Cancelled
 * 
 * Safety & Academic SEPM rules:
 * - Past dates strictly rejected.
 * - Non-participants cannot mutate session states.
 * - Credit reward (+5) awarded ONLY ONCE upon successful completion.
 * - Automated in-app notifications generated on every event.
 */

const { Session, User, CreditTransaction, Notification } = require('../models');

// Helper to validate YYYY-MM-DD date is not in the past
const isDateInPast = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return target < today;
};

// @desc    Create a new learning session request
// @route   POST /api/sessions
// @access  Private
const createSession = async (req, res) => {
  try {
    const learnerId = (req.user._id || req.user.id).toString();
    const { teacherId, skillName, date, time, durationMinutes, message, meetingLink } = req.body;

    if (!teacherId || !skillName || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide teacher, skill name, date, and time.'
      });
    }

    if (teacherId.toString() === learnerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request a session with yourself.'
      });
    }

    // Verify date is not in the past
    if (isDateInPast(date)) {
      return res.status(400).json({
        success: false,
        message: 'Booking date cannot be in the past. Please select today or a future date.'
      });
    }

    // Verify teacher exists
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.isActive === false) {
      return res.status(404).json({
        success: false,
        message: 'Selected peer mentor was not found or is currently inactive.'
      });
    }

    // Check for existing active session at exact date and time between the participants
    const existingConflict = await Session.findOne({
      date,
      time,
      $or: [
        { teacherId, learnerId },
        { teacherId: learnerId, learnerId: teacherId }
      ]
    });

    if (existingConflict && (existingConflict.status === 'pending' || existingConflict.status === 'accepted')) {
      return res.status(400).json({
        success: false,
        message: 'A session between these participants is already scheduled or pending for this date and time.'
      });
    }

    const duration = Number(durationMinutes) || 60;

    const newSession = await Session.create({
      teacherId,
      learnerId,
      skillName: skillName.trim(),
      date,
      time,
      durationMinutes: duration,
      message: message ? message.trim() : '',
      meetingLink: meetingLink ? meetingLink.trim() : 'Google Meet / College Library',
      status: 'pending',
      creditsAwarded: false
    });

    // Notify teacher
    await Notification.create({
      userId: teacherId,
      title: 'New Session Request 🎓',
      message: `${req.user.name} requested to learn "${skillName}" with you on ${date} at ${time}.`,
      type: 'request_received',
      link: '/sessions'
    });

    res.status(201).json({
      success: true,
      message: 'Session request sent to peer mentor successfully!',
      session: newSession
    });
  } catch (err) {
    console.error('Create session error:', err);
    res.status(500).json({ success: false, message: 'Failed to create session request.' });
  }
};

// @desc    Get all sessions for current user (incoming & outgoing)
// @route   GET /api/sessions
// @access  Private
const getMySessions = async (req, res) => {
  try {
    const currentUserId = (req.user._id || req.user.id).toString();

    // Fetch sessions where user is teacher OR learner
    const allSessions = await Session.find({
      $or: [
        { teacherId: currentUserId },
        { learnerId: currentUserId }
      ]
    });

    // Populate participant profiles
    const usersMap = {};
    const allUsers = await User.find({});
    allUsers.forEach(u => {
      const uId = (u._id || u.id).toString();
      usersMap[uId] = {
        _id: uId,
        name: u.name,
        email: u.email,
        department: u.department,
        yearOfStudy: u.yearOfStudy,
        averageRating: u.averageRating || 5.0
      };
    });

    const populatedSessions = allSessions.map(s => {
      const tId = s.teacherId ? s.teacherId.toString() : '';
      const lId = s.learnerId ? s.learnerId.toString() : '';
      return {
        ...s,
        teacher: usersMap[tId] || { name: 'Student Mentor' },
        learner: usersMap[lId] || { name: 'Student Learner' },
        isTeacher: tId === currentUserId,
        isLearner: lId === currentUserId
      };
    });

    // Separate incoming vs outgoing for convenient frontend tabs
    const incoming = populatedSessions.filter(s => s.isTeacher && s.status === 'pending');
    const outgoing = populatedSessions.filter(s => s.isLearner && s.status === 'pending');
    const accepted = populatedSessions.filter(s => s.status === 'accepted');
    const completed = populatedSessions.filter(s => s.status === 'completed');
    const history = populatedSessions.filter(s => ['completed', 'rejected', 'cancelled'].includes(s.status));

    res.status(200).json({
      success: true,
      count: populatedSessions.length,
      incoming,
      outgoing,
      accepted,
      completed,
      history,
      all: populatedSessions
    });
  } catch (err) {
    console.error('Get sessions error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch sessions.' });
  }
};

// @desc    Accept a pending session request
// @route   PUT /api/sessions/:id/accept
// @access  Private
const acceptSession = async (req, res) => {
  try {
    const currentUserId = (req.user._id || req.user.id).toString();
    const sessionId = req.params.id;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    if (session.teacherId.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Only the requested teacher can accept this session.'
      });
    }

    if (session.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot accept a session that is already ${session.status}.`
      });
    }

    const updated = await Session.findByIdAndUpdate(
      sessionId,
      { status: 'accepted' },
      { new: true }
    );

    // Notify learner
    await Notification.create({
      userId: session.learnerId,
      title: 'Session Request Accepted! 🎉',
      message: `${req.user.name} accepted your request to learn "${session.skillName}" on ${session.date}.`,
      type: 'request_accepted',
      link: '/sessions'
    });

    res.status(200).json({
      success: true,
      message: 'Session accepted successfully!',
      session: updated
    });
  } catch (err) {
    console.error('Accept session error:', err);
    res.status(500).json({ success: false, message: 'Failed to accept session.' });
  }
};

// @desc    Reject a pending session request
// @route   PUT /api/sessions/:id/reject
// @access  Private
const rejectSession = async (req, res) => {
  try {
    const currentUserId = (req.user._id || req.user.id).toString();
    const sessionId = req.params.id;
    const { reason } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    if (session.teacherId.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Only the requested teacher can reject this session.'
      });
    }

    if (session.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject a session that is already ${session.status}.`
      });
    }

    const updated = await Session.findByIdAndUpdate(
      sessionId,
      { 
        status: 'rejected',
        cancellationReason: reason ? reason.trim() : 'Schedule conflict'
      },
      { new: true }
    );

    // Notify learner
    await Notification.create({
      userId: session.learnerId,
      title: 'Session Request Declined',
      message: `${req.user.name} was unable to accept your request for "${session.skillName}".`,
      type: 'request_rejected',
      link: '/sessions'
    });

    res.status(200).json({
      success: true,
      message: 'Session request rejected.',
      session: updated
    });
  } catch (err) {
    console.error('Reject session error:', err);
    res.status(500).json({ success: false, message: 'Failed to reject session.' });
  }
};

// @desc    Cancel an accepted or pending session
// @route   PUT /api/sessions/:id/cancel
// @access  Private
const cancelSession = async (req, res) => {
  try {
    const currentUserId = (req.user._id || req.user.id).toString();
    const sessionId = req.params.id;
    const { reason } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const isTeacher = session.teacherId.toString() === currentUserId;
    const isLearner = session.learnerId.toString() === currentUserId;

    if (!isTeacher && !isLearner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You are not a participant in this session.'
      });
    }

    if (session.status === 'completed' || session.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a session that is already ${session.status}.`
      });
    }

    const updated = await Session.findByIdAndUpdate(
      sessionId,
      {
        status: 'cancelled',
        cancelledBy: currentUserId,
        cancellationReason: reason ? reason.trim() : 'Cancelled by participant'
      },
      { new: true }
    );

    // Notify the other party
    const otherUserId = isTeacher ? session.learnerId : session.teacherId;
    await Notification.create({
      userId: otherUserId,
      title: 'Session Cancelled ⚠️',
      message: `${req.user.name} cancelled the session for "${session.skillName}" scheduled on ${session.date}.`,
      type: 'session_cancelled',
      link: '/sessions'
    });

    res.status(200).json({
      success: true,
      message: 'Session cancelled successfully.',
      session: updated
    });
  } catch (err) {
    console.error('Cancel session error:', err);
    res.status(500).json({ success: false, message: 'Failed to cancel session.' });
  }
};

// @desc    Mark a session as completed and award credits to teacher
// @route   PUT /api/sessions/:id/complete
// @access  Private
const completeSession = async (req, res) => {
  try {
    const currentUserId = (req.user._id || req.user.id).toString();
    const sessionId = req.params.id;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const isTeacher = session.teacherId.toString() === currentUserId;
    const isLearner = session.learnerId.toString() === currentUserId;

    if (!isTeacher && !isLearner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only session participants or admins can mark it completed.'
      });
    }

    if (session.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: `Only accepted sessions can be marked completed (current status: ${session.status}).`
      });
    }

    const rewardCredits = Number(process.env.CREDITS_PER_COMPLETED_SESSION) || 5;
    const durationHours = (Number(session.durationMinutes) || 60) / 60;

    // Safety guard: award credits ONLY ONCE
    if (!session.creditsAwarded) {
      const teacher = await User.findById(session.teacherId);
      if (teacher) {
        const newBalance = (teacher.credits || 0) + rewardCredits;
        const newHoursTaught = Number(((teacher.totalHoursTaught || 0) + durationHours).toFixed(1));
        const newTeacherSessions = (teacher.totalSessionsCompleted || 0) + 1;

        await User.findByIdAndUpdate(session.teacherId, { 
          credits: newBalance,
          totalHoursTaught: newHoursTaught,
          totalSessionsCompleted: newTeacherSessions
        });

        // Record credit transaction ledger
        await CreditTransaction.create({
          userId: session.teacherId,
          amount: rewardCredits,
          type: 'session_teaching_reward',
          description: `Earned +${rewardCredits} credits for teaching "${session.skillName}"`,
          referenceSessionId: sessionId
        });

        // Notify teacher of credit reward
        await Notification.create({
          userId: session.teacherId,
          title: `+${rewardCredits} Credits Earned! 🏆`,
          message: `Congratulations! You received ${rewardCredits} skill credits for conducting the session on "${session.skillName}".`,
          type: 'credits_earned',
          link: '/progress'
        });
      }

      // Update learner total hours learned and completed sessions count
      const learner = await User.findById(session.learnerId);
      if (learner) {
        const newHoursLearned = Number(((learner.totalHoursLearned || 0) + durationHours).toFixed(1));
        const newLearnerSessions = (learner.totalSessionsCompleted || 0) + 1;

        await User.findByIdAndUpdate(session.learnerId, {
          totalHoursLearned: newHoursLearned,
          totalSessionsCompleted: newLearnerSessions
        });
      }
    }

    const updated = await Session.findByIdAndUpdate(
      sessionId,
      {
        status: 'completed',
        creditsAwarded: true,
        completedAt: new Date().toISOString()
      },
      { new: true }
    );

    // Notify learner to leave review
    await Notification.create({
      userId: session.learnerId,
      title: 'Session Completed! Leave a Review ⭐',
      message: `Your learning session for "${session.skillName}" is marked completed. Share your feedback for your peer mentor!`,
      type: 'session_completed',
      link: '/reviews'
    });

    res.status(200).json({
      success: true,
      message: `Session completed! +${rewardCredits} credits awarded to teacher.`,
      session: updated
    });
  } catch (err) {
    console.error('Complete session error:', err);
    res.status(500).json({ success: false, message: 'Failed to complete session.' });
  }
};

module.exports = {
  createSession,
  getMySessions,
  acceptSession,
  rejectSession,
  cancelSession,
  completeSession
};
