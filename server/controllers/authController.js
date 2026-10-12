/**
 * controllers/authController.js
 * 
 * Purpose: Handles Student & Admin Authentication and Profile Management.
 * Follows secure standards:
 * - Password hashing using bcryptjs.
 * - Stateless session management via JWT.
 * - Input validation & duplicate email prevention.
 * - Initial credit award recorded in CreditTransaction ledger.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { User, CreditTransaction, Notification } = require('../models');

// Helper to generate signed JWT
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'peer_skill_exchange_super_secret_jwt_key_2026';
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  return jwt.sign({ id }, secret, { expiresIn });
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, department, yearOfStudy } = req.body;

    // Validation
    if (!name || !email || !password || !department || !yearOfStudy) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, department, and year of study.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A student account with this email address already exists.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const initialCredits = Number(process.env.INITIAL_STUDENT_CREDITS) || 10;

    // Create user
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      department: department.trim(),
      yearOfStudy,
      college: 'College of Engineering & Technology',
      picture: '',
      credits: initialCredits,
      role: 'student',
      skillsTeachable: [],
      skillsWanted: [],
      bio: 'Enthusiastic college student ready to share skills and learn from peers!',
      interests: [],
      averageRating: 5.0,
      reviewCount: 0,
      totalSessionsCompleted: 0,
      totalHoursTaught: 0,
      totalHoursLearned: 0,
      isActive: true
    });

    const userId = newUser._id || newUser.id;

    // Record welcome bonus transaction
    await CreditTransaction.create({
      userId,
      amount: initialCredits,
      type: 'initial_bonus',
      description: 'Welcome bonus on registration'
    });

    const token = generateToken(userId);

    // Exclude password in response
    const userSafe = { ...newUser };
    delete userSafe.password;

    res.status(201).json({
      success: true,
      message: 'Account registered successfully! Welcome bonus credited.',
      token,
      user: userSafe
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.'
    });
  }
};

// @desc    Authenticate student / admin & return token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Account suspended. Please contact platform administration.'
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account was created with Google Sign-In. Please sign in using Google.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    const userId = user._id || user.id;
    const token = generateToken(userId);

    const userSafe = { ...user };
    delete userSafe.password;

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: userSafe
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.'
    });
  }
};

// @desc    Google Sign-In / Auto-Registration via Google Identity Services
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { credential, idToken } = req.body;
    const token = credential || idToken;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token credential is required.'
      });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({
        success: false,
        message: 'GOOGLE_CLIENT_ID is not configured on the server. Please configure it in .env.'
      });
    }

    const client = new OAuth2Client(clientId);
    let payload;

    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientId
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      console.error('Google token verification error:', verifyError.message);
      return res.status(401).json({
        success: false,
        message: 'Google authentication failed: Invalid or expired ID token.'
      });
    }

    if (!payload || !payload.email) {
      return res.status(401).json({
        success: false,
        message: 'Unable to extract verified user profile from Google token.'
      });
    }

    if (!payload.email_verified) {
      return res.status(401).json({
        success: false,
        message: 'Google email address is not verified by Google.'
      });
    }

    const googleId = payload.sub;
    const email = payload.email.trim().toLowerCase();
    const name = payload.name || payload.given_name || 'Student';
    const picture = payload.picture || '';

    // Check for existing user by googleId or email
    let user = await User.findOne({
      $or: [
        { googleId },
        { email }
      ]
    });

    const initialCredits = Number(process.env.INITIAL_STUDENT_CREDITS) || 10;

    if (!user) {
      // Auto-register new student account
      user = await User.create({
        name,
        email,
        googleId,
        picture,
        college: 'College of Engineering & Technology',
        department: 'Computer Science & Engineering',
        yearOfStudy: '1st Year',
        credits: initialCredits,
        role: 'student',
        skillsTeachable: [],
        skillsWanted: [],
        bio: 'College student learning and exchanging skills on PeerSkill!',
        interests: [],
        averageRating: 5.0,
        reviewCount: 0,
        totalSessionsCompleted: 0,
        totalHoursTaught: 0,
        totalHoursLearned: 0,
        isActive: true
      });

      const userId = user._id || user.id;

      // Welcome bonus
      await CreditTransaction.create({
        userId,
        amount: initialCredits,
        type: 'initial_bonus',
        description: 'Welcome bonus on Google account registration'
      });

      await Notification.create({
        userId,
        title: 'Welcome to PeerSkill! 🎉',
        message: 'Your Google account is registered! 10 welcome credits have been added. Add your skills to start exchanging.',
        type: 'system',
        link: '/skills'
      });
    } else {
      if (user.isActive === false) {
        return res.status(403).json({
          success: false,
          message: 'Account suspended. Please contact platform administration.'
        });
      }

      // Update googleId and picture if missing
      const updates = {};
      if (!user.googleId) updates.googleId = googleId;
      if (!user.picture && picture) updates.picture = picture;

      if (Object.keys(updates).length > 0) {
        const uId = user._id || user.id;
        user = await User.findByIdAndUpdate(uId, updates, { new: true });
      }
    }

    const userId = user._id || user.id;
    const jwtToken = generateToken(userId);

    const userSafe = { ...user };
    delete userSafe.password;

    res.status(200).json({
      success: true,
      message: 'Google Sign-In successful.',
      token: jwtToken,
      user: userSafe
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during Google Sign-In. Please try again.'
    });
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const userSafe = { ...user };
    delete userSafe.password;
    res.status(200).json({ success: true, user: userSafe });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};

// @desc    Get public profile of another student
// @route   GET /api/auth/student/:id
// @access  Private
const getPublicProfile = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const user = await User.findById(targetUserId);

    if (!user || user.isActive === false) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found or inactive.'
      });
    }

    // Never expose private info (password, credits, private transactions)
    const publicProfile = {
      _id: user._id || user.id,
      name: user.name,
      college: user.college || 'College of Engineering & Technology',
      department: user.department,
      yearOfStudy: user.yearOfStudy,
      picture: user.picture || '',
      bio: user.bio || '',
      interests: user.interests || [],
      skillsTeachable: user.skillsTeachable || [],
      skillsWanted: user.skillsWanted || [],
      averageRating: user.averageRating || 5.0,
      reviewCount: user.reviewCount || 0,
      totalSessionsCompleted: user.totalSessionsCompleted || 0,
      totalHoursTaught: user.totalHoursTaught || 0,
      totalHoursLearned: user.totalHoursLearned || 0,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      student: publicProfile
    });
  } catch (err) {
    console.error('Get public profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve student profile.' });
  }
};

// @desc    Update profile details
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, department, yearOfStudy, bio, interests, college, picture } = req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (department) updates.department = department.trim();
    if (yearOfStudy) updates.yearOfStudy = yearOfStudy;
    if (typeof bio === 'string') updates.bio = bio.trim();
    if (Array.isArray(interests)) updates.interests = interests;
    if (college) updates.college = college.trim();
    if (typeof picture === 'string') updates.picture = picture.trim();

    const updated = await User.findByIdAndUpdate(userId, updates, { new: true });
    const userSafe = { ...updated };
    delete userSafe.password;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: userSafe
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

module.exports = {
  register,
  login,
  googleAuth,
  getMe,
  getPublicProfile,
  updateProfile
};
