/**
 * server.js
 * 
 * Entry point for Peer Skill Exchange Platform Backend API.
 * Orchestrates Express middleware, database connectivity, and REST endpoints.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const { connectDB, getDBState } = require('./config/db');

// Import route modules
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const matchRoutes = require('./routes/matchRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Global Middleware
app.use(cors({
  origin: '*', // Allow frontend client
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development / SEPM audit
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

// Health check endpoint (Required by prompt & SEPM verification)
app.get('/api/health', (req, res) => {
  const dbInfo = getDBState();
  res.status(200).json({
    status: 'healthy',
    service: 'Peer Skill Exchange Platform API',
    version: '1.0.0',
    database: {
      mode: dbInfo.mode,
      connected: dbInfo.connected,
      description: dbInfo.mode === 'mongodb' 
        ? 'MongoDB Connection Active' 
        : 'Persistent Local JSON Store Active (zero-config evaluation mode)'
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Peer Skill Exchange Platform API',
    health: '/api/health',
    docs: 'Refer to /docs for SRS, Project Plan, and Architecture diagrams'
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on this server.`
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

// Export app for automated testing
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Peer Skill Exchange Server running on http://localhost:${PORT}`);
      console.log(`📡 Health Check available at http://localhost:${PORT}/api/health`);
    });
  });
}

module.exports = app;
