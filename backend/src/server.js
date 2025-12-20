const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection on startup
testConnection();

// Import routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const aiRoutes = require('./routes/aiRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 K_AI Job Tracker API is running!',
    version: '1.0.0',
    database: '✅ Connected to Supabase',
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      ai: '/api/ai'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/pdf', pdfRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   🚀 K_AI Job Tracker API Server      ║
  ║   📡 Port: ${PORT}                        ║
  ║   🌍 Environment: ${process.env.NODE_ENV}         ║
  ║   ✅ Status: Running                   ║
  ╚════════════════════════════════════════╝
  `);
});

module.exports = app;