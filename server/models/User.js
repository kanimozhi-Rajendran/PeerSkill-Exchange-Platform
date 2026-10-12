/**
 * models/User.js
 * 
 * Purpose: Defines User Schema for Student and Admin profiles.
 * Includes skills teachable, skills wanted, department, credits, rating.
 */

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['Programming', 'Data Science', 'Design', 'Languages', 'Engineering', 'Academics', 'Music & Arts', 'Other'],
    default: 'Programming'
  },
  proficiency: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    default: 'Intermediate' 
  },
  description: { type: String, default: '' },
  addedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: false }, // Optional for Google OAuth users
  googleId: { type: String, default: null, sparse: true },
  picture: { type: String, default: '' },
  college: { type: String, default: 'College of Engineering & Technology', trim: true },
  department: { type: String, default: 'Computer Science & Engineering', trim: true },
  yearOfStudy: { 
    type: String, 
    default: '1st Year',
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'] 
  },
  bio: { type: String, default: 'Enthusiastic college student eager to learn and share skills!' },
  interests: [{ type: String }],
  skillsTeachable: [skillSchema],
  skillsWanted: [skillSchema],
  credits: { type: Number, default: 10 }, // 10 initial credits
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  averageRating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  totalSessionsCompleted: { type: Number, default: 0 },
  totalHoursTaught: { type: Number, default: 0 },
  totalHoursLearned: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

