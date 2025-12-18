const JobApplication = require('../models/JobApplication');

// Create new job application
const createJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobData = req.body;

    // Validation
    if (!jobData.companyName || !jobData.jobTitle) {
      return res.status(400).json({
        error: 'Company name and job title are required.'
      });
    }

    // Validate status if provided
    const validStatuses = ['applied', 'interviewing', 'offered', 'rejected', 'accepted'];
    if (jobData.status && !validStatuses.includes(jobData.status)) {
      return res.status(400).json({
        error: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const job = await JobApplication.create(userId, jobData);

    res.status(201).json({
      message: 'Job application created successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      error: 'Failed to create job application.'
    });
  }
};

// Get all job applications for user
const getJobs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;

    const filters = {};
    if (status) {
      filters.status = status;
    }

    const jobs = await JobApplication.findByUserId(userId, filters);

    res.json({
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      error: 'Failed to retrieve job applications.'
    });
  }
};

// Get single job application
const getJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const job = await JobApplication.findById(id, userId);

    if (!job) {
      return res.status(404).json({
        error: 'Job application not found.'
      });
    }

    res.json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      error: 'Failed to retrieve job application.'
    });
  }
};

// Update job application
const updateJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const updates = req.body;

    // Validate status if provided
    const validStatuses = ['applied', 'interviewing', 'offered', 'rejected', 'accepted'];
    if (updates.status && !validStatuses.includes(updates.status)) {
      return res.status(400).json({
        error: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const job = await JobApplication.update(id, userId, updates);

    if (!job) {
      return res.status(404).json({
        error: 'Job application not found.'
      });
    }

    res.json({
      message: 'Job application updated successfully',
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      error: 'Failed to update job application.'
    });
  }
};

// Delete job application
const deleteJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const job = await JobApplication.delete(id, userId);

    if (!job) {
      return res.status(404).json({
        error: 'Job application not found.'
      });
    }

    res.json({
      message: 'Job application deleted successfully',
      job
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      error: 'Failed to delete job application.'
    });
  }
};

// Get jobs grouped by status (for Kanban board)
const getJobsByStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const grouped = await JobApplication.getByStatus(userId);

    res.json({ board: grouped });
  } catch (error) {
    console.error('Get jobs by status error:', error);
    res.status(500).json({
      error: 'Failed to retrieve job applications by status.'
    });
  }
};

// Get statistics
const getStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const stats = await JobApplication.getStats(userId);

    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve statistics.'
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getJobsByStatus,
  getStats
};