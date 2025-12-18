const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getJobsByStatus,
  getStats
} = require('../controllers/jobController');

// All routes require authentication
router.use(authenticateToken);

// Job CRUD routes
router.post('/', createJob);              // Create job
router.get('/', getJobs);                 // Get all jobs (with optional status filter)
router.get('/board', getJobsByStatus);    // Get jobs grouped by status
router.get('/stats', getStats);           // Get statistics
router.get('/:id', getJob);               // Get single job
router.put('/:id', updateJob);            // Update job
router.delete('/:id', deleteJob);         // Delete job

module.exports = router;