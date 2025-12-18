const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  analyzeMatch,
  getMatch,
  reanalyzeMatch
} = require('../controllers/aiController');

// All routes require authentication
router.use(authenticateToken);

// AI analysis routes
router.post('/analyze', analyzeMatch);           // Analyze resume-job match
router.post('/reanalyze', reanalyzeMatch);       // Force re-analysis
router.get('/match/:jobId', getMatch);           // Get existing match result

module.exports = router;