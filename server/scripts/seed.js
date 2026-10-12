/**
 * scripts/seed.js
 * 
 * Purpose: Populates realistic college student profiles, skills,
 * mutual matches, sessions, reviews, and admin account.
 * Run via: `npm run seed` or `node scripts/seed.js`
 */

const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { connectDB, getDBState } = require('../config/db');
const { User, Session, Review, CreditTransaction, Notification, writeRawDb } = require('../models');

async function seed() {
  console.log('🌱 Starting Peer Skill Exchange Database Seed...');
  await connectDB();

  const salt = await bcrypt.genSalt(10);
  const studentPassword = await bcrypt.hash('Password@123', salt);
  const adminPassword = await bcrypt.hash('Admin@123', salt);

  // If file storage mode, reset the db.json
  if (getDBState().mode === 'file') {
    writeRawDb({
      users: [],
      sessions: [],
      reviews: [],
      creditTransactions: [],
      notifications: []
    });
  }

  // 1. Create Students
  console.log('Creating student profiles...');

  const priya = await User.create({
    name: 'Priya Sharma',
    email: 'priya@peerskill.edu',
    password: studentPassword,
    department: 'Computer Science & Engineering',
    yearOfStudy: '3rd Year',
    bio: 'Passionate about web development and algorithms. Love helping peers get started with Python!',
    interests: ['Full Stack', 'Competitive Coding', 'Open Source'],
    credits: 20,
    role: 'student',
    averageRating: 4.9,
    reviewCount: 3,
    isActive: true,
    skillsTeachable: [
      {
        id: 'sk_teach_1',
        name: 'Python',
        category: 'Programming',
        proficiency: 'Advanced',
        description: 'Core syntax, OOP concepts, data structures, and script automation.'
      },
      {
        id: 'sk_teach_2',
        name: 'React.js',
        category: 'Programming',
        proficiency: 'Intermediate',
        description: 'Component architecture, Hooks (useState, useEffect), and responsive UI.'
      }
    ],
    skillsWanted: [
      {
        id: 'sk_want_1',
        name: 'Excel',
        category: 'Data Science',
        proficiency: 'Intermediate',
        description: 'Formulas, VLOOKUP, pivot tables, and dashboard charting.'
      },
      {
        id: 'sk_want_2',
        name: 'Public Speaking',
        category: 'Languages',
        proficiency: 'Beginner',
        description: 'Presentation delivery and seminar confidence.'
      }
    ]
  });

  const rahul = await User.create({
    name: 'Rahul Verma',
    email: 'rahul@peerskill.edu',
    password: studentPassword,
    department: 'Data Science & Analytics',
    yearOfStudy: '3rd Year',
    bio: 'Data science enthusiast. Experienced in spreadsheet automation and statistical modeling.',
    interests: ['Machine Learning', 'Business Analytics', 'Python'],
    credits: 15,
    role: 'student',
    averageRating: 5.0,
    reviewCount: 2,
    isActive: true,
    skillsTeachable: [
      {
        id: 'sk_teach_3',
        name: 'Excel',
        category: 'Data Science',
        proficiency: 'Advanced',
        description: 'Advanced macros, power query, financial modeling, and pivot charts.'
      },
      {
        id: 'sk_teach_4',
        name: 'Machine Learning',
        category: 'Data Science',
        proficiency: 'Intermediate',
        description: 'Scikit-Learn, regression, classification, and model evaluation.'
      }
    ],
    skillsWanted: [
      {
        id: 'sk_want_3',
        name: 'Python',
        category: 'Programming',
        proficiency: 'Intermediate',
        description: 'Clean coding conventions and backend APIs with Flask/Express.'
      },
      {
        id: 'sk_want_4',
        name: 'React.js',
        category: 'Programming',
        proficiency: 'Beginner',
        description: 'Building modern dashboards for data visualizations.'
      }
    ]
  });

  const ananya = await User.create({
    name: 'Ananya Patel',
    email: 'ananya@peerskill.edu',
    password: studentPassword,
    department: 'Electrical & Electronics',
    yearOfStudy: '2nd Year',
    bio: 'Self-taught UI/UX designer and Figma lover. Excited to trade design skills for coding help!',
    interests: ['UI/UX', 'Product Design', 'Figma', 'Embedded Systems'],
    credits: 12,
    role: 'student',
    averageRating: 4.8,
    reviewCount: 2,
    isActive: true,
    skillsTeachable: [
      {
        id: 'sk_teach_5',
        name: 'Figma & UI Design',
        category: 'Design',
        proficiency: 'Advanced',
        description: 'Wireframing, auto-layout, design systems, and clickable prototypes.'
      },
      {
        id: 'sk_teach_6',
        name: 'Graphic Design',
        category: 'Design',
        proficiency: 'Intermediate',
        description: 'Poster design, typography, and color theory for college fests.'
      }
    ],
    skillsWanted: [
      {
        id: 'sk_want_5',
        name: 'C++',
        category: 'Programming',
        proficiency: 'Intermediate',
        description: 'Pointers, memory management, and OOP for microcontroller programming.'
      }
    ]
  });

  const karthik = await User.create({
    name: 'Karthik Iyer',
    email: 'karthik@peerskill.edu',
    password: studentPassword,
    department: 'Mechanical Engineering',
    yearOfStudy: '4th Year',
    bio: 'Robotics and CAD modeling enthusiast. Keen to learn UI design for our robotics team website.',
    interests: ['Robotics', 'CAD', 'C++', 'Automation'],
    credits: 18,
    role: 'student',
    averageRating: 5.0,
    reviewCount: 1,
    isActive: true,
    skillsTeachable: [
      {
        id: 'sk_teach_7',
        name: 'C++',
        category: 'Programming',
        proficiency: 'Advanced',
        description: 'Object-oriented programming, STL, and performance tuning.'
      },
      {
        id: 'sk_teach_8',
        name: 'AutoCAD',
        category: 'Engineering',
        proficiency: 'Advanced',
        description: '2D drafting, engineering drawings, and geometric dimensioning.'
      }
    ],
    skillsWanted: [
      {
        id: 'sk_want_6',
        name: 'Figma & UI Design',
        category: 'Design',
        proficiency: 'Beginner',
        description: 'Creating mockups for our engineering capstone presentation.'
      }
    ]
  });

  // Admin Account
  const admin = await User.create({
    name: 'College Platform Administrator',
    email: 'admin@peerskill.edu',
    password: adminPassword,
    department: 'Department of Academic Affairs',
    yearOfStudy: 'Postgraduate',
    bio: 'System Administrator overseeing peer-to-peer student learning and quality assurance.',
    interests: ['Platform Governance', 'Academic Integrity'],
    credits: 100,
    role: 'admin',
    averageRating: 5.0,
    reviewCount: 0,
    isActive: true,
    skillsTeachable: [],
    skillsWanted: []
  });

  const priyaId = priya._id || priya.id;
  const rahulId = rahul._id || rahul.id;
  const ananyaId = ananya._id || ananya.id;
  const karthikId = karthik._id || karthik.id;

  // 2. Create Sample Sessions
  console.log('Creating sample learning sessions...');

  // Completed Session: Priya taught Rahul Python
  const session1 = await Session.create({
    teacherId: priyaId,
    learnerId: rahulId,
    skillName: 'Python',
    date: '2026-10-08',
    time: '16:00',
    durationMinutes: 60,
    message: 'Looking forward to learning Python list comprehensions and dictionaries!',
    meetingLink: 'https://meet.google.com/abc-demo-session',
    status: 'completed',
    creditsAwarded: true,
    completedAt: '2026-10-08T17:00:00.000Z'
  });

  // Review for Session 1
  await Review.create({
    sessionId: session1._id || session1.id,
    reviewerId: rahulId,
    revieweeId: priyaId,
    rating: 5,
    comment: 'Priya was amazing! She explained Python OOP with clear real-world examples. Highly recommend!',
    skillName: 'Python'
  });

  // Credit Transaction for Priya
  await CreditTransaction.create({
    userId: priyaId,
    amount: 5,
    type: 'session_teaching_reward',
    description: 'Earned +5 credits for teaching Python to Rahul Verma',
    referenceSessionId: session1._id || session1.id
  });

  // Accepted Upcoming Session: Rahul teaching Priya Excel tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const session2 = await Session.create({
    teacherId: rahulId,
    learnerId: priyaId,
    skillName: 'Excel',
    date: tomorrowStr,
    time: '15:30',
    durationMinutes: 90,
    message: 'Let us master VLOOKUP and XLOOKUP with college exam datasets!',
    meetingLink: 'https://meet.google.com/xyz-excel-learning',
    status: 'accepted',
    creditsAwarded: false
  });

  // Pending Request: Ananya requested Karthik for C++
  const session3 = await Session.create({
    teacherId: karthikId,
    learnerId: ananyaId,
    skillName: 'C++',
    date: tomorrowStr,
    time: '17:00',
    durationMinutes: 60,
    message: 'Hi Karthik, I need help with C++ memory pointers for my robotics project!',
    meetingLink: 'Library 2nd Floor Study Room 4',
    status: 'pending',
    creditsAwarded: false
  });

  // Sample Notifications
  console.log('Creating sample notifications...');
  await Notification.create({
    userId: priyaId,
    title: 'Upcoming Session Tomorrow 📅',
    message: `You have an accepted session for "Excel" with Rahul Verma on ${tomorrowStr} at 15:30.`,
    type: 'request_accepted',
    link: '/sessions',
    isRead: false
  });

  await Notification.create({
    userId: karthikId,
    title: 'New Session Request 🎓',
    message: `Ananya Patel requested to learn "C++" with you on ${tomorrowStr} at 17:00.`,
    type: 'request_received',
    link: '/sessions',
    isRead: false
  });

  console.log('✅ Database seeded successfully!');
  console.log('---------------------------------------------------------');
  console.log('Demo Credentials:');
  console.log('Student A (Priya Sharma):  priya@peerskill.edu  / Password@123');
  console.log('Student B (Rahul Verma):  rahul@peerskill.edu  / Password@123');
  console.log('Student C (Ananya Patel): ananya@peerskill.edu / Password@123');
  console.log('Student D (Karthik Iyer): karthik@peerskill.edu/ Password@123');
  console.log('Admin User:               admin@peerskill.edu  / Admin@123');
  console.log('---------------------------------------------------------');
}

if (require.main === module) {
  seed().then(() => {
    process.exit(0);
  }).catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
}

module.exports = seed;
