const JobApplication = require('../models/JobApplication');
const MatchResult = require('../models/MatchResult');
const User = require('../models/User');
const { analyzeResumeMatch } = require('../services/groqService');

// Analyze resume-job match
const analyzeMatch = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { jobApplicationId } = req.body;

    // Validation
    if (!jobApplicationId) {
      return res.status(400).json({
        error: 'Job application ID is required.'
      });
    }

    // Get job application
    const job = await JobApplication.findById(jobApplicationId, userId);
    if (!job) {
      return res.status(404).json({
        error: 'Job application not found.'
      });
    }

    // Get user's resume
    const user = await User.findById(userId);
    if (!user.resume_text) {
      return res.status(400).json({
        error: 'Please add your resume text before analyzing matches.',
        hint: 'Use PUT /api/auth/resume to add your resume'
      });
    }

    // Check if we already have a match result (caching)
    const existingMatch = await MatchResult.findByJobId(jobApplicationId);
    if (existingMatch) {
      return res.json({
        message: 'Match analysis retrieved from cache',
        cached: true,
        match: existingMatch,
        job: {
          id: job.id,
          companyName: job.company_name,
          jobTitle: job.job_title
        }
      });
    }

    // Perform AI analysis
    console.log(`🤖 Analyzing match for job ${jobApplicationId}...`);
    
    const analysis = await analyzeResumeMatch(
      user.resume_text,
      job.job_description || `Position: ${job.job_title} at ${job.company_name}`,
      job.job_title,
      job.company_name
    );

    // Store the result
    const matchResult = await MatchResult.createOrUpdate(jobApplicationId, analysis);

    // Parse the stored result
    const parsedMatch = await MatchResult.findByJobId(jobApplicationId);

    res.json({
      message: 'Match analysis completed successfully',
      cached: false,
      match: parsedMatch,
      job: {
        id: job.id,
        companyName: job.company_name,
        jobTitle: job.job_title
      }
    });

  } catch (error) {
    console.error('Analyze match error:', error);
    res.status(500).json({
      error: 'Failed to analyze resume-job match.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get match result for a job
const getMatch = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { jobId } = req.params;

    // Verify job belongs to user
    const job = await JobApplication.findById(jobId, userId);
    if (!job) {
      return res.status(404).json({
        error: 'Job application not found.'
      });
    }

    // Get match result
    const match = await MatchResult.findByJobId(jobId);
    
    if (!match) {
      return res.status(404).json({
        error: 'No match analysis found for this job.',
        hint: 'Use POST /api/ai/analyze to create an analysis'
      });
    }

    res.json({
      match,
      job: {
        id: job.id,
        companyName: job.company_name,
        jobTitle: job.job_title
      }
    });

  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({
      error: 'Failed to retrieve match analysis.'
    });
  }
};

// Re-analyze (force new analysis, ignore cache)
const reanalyzeMatch = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { jobApplicationId } = req.body;

    if (!jobApplicationId) {
      return res.status(400).json({
        error: 'Job application ID is required.'
      });
    }

    const job = await JobApplication.findById(jobApplicationId, userId);
    if (!job) {
      return res.status(404).json({
        error: 'Job application not found.'
      });
    }

    const user = await User.findById(userId);
    if (!user.resume_text) {
      return res.status(400).json({
        error: 'Please add your resume text before analyzing matches.'
      });
    }

    // Delete existing match (to force re-analysis)
    await MatchResult.delete(jobApplicationId);

    // Perform new analysis
    console.log(`🔄 Re-analyzing match for job ${jobApplicationId}...`);
    
    const analysis = await analyzeResumeMatch(
      user.resume_text,
      job.job_description || `Position: ${job.job_title} at ${job.company_name}`,
      job.job_title,
      job.company_name
    );

    const matchResult = await MatchResult.createOrUpdate(jobApplicationId, analysis);
    const parsedMatch = await MatchResult.findByJobId(jobApplicationId);

    res.json({
      message: 'Match re-analysis completed successfully',
      match: parsedMatch,
      job: {
        id: job.id,
        companyName: job.company_name,
        jobTitle: job.job_title
      }
    });

  } catch (error) {
    console.error('Re-analyze match error:', error);
    res.status(500).json({
      error: 'Failed to re-analyze resume-job match.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  analyzeMatch,
  getMatch,
  reanalyzeMatch
};