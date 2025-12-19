import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import StatsCards from '../../components/jobs/StatsCards';
import JobCard from '../../components/jobs/JobCard';
import JobForm from '../../components/jobs/JobForm';
import MatchResultModal from '../../components/jobs/MatchResultModal';
import { jobsAPI, aiAPI } from '../../services/api';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  
  // Match modal state
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Match results cache
  const [matchResults, setMatchResults] = useState({});

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  // Fetch match results when jobs change
  useEffect(() => {
    if (jobs.length > 0) {
      fetchMatchResults();
    }
  }, [jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getAll(filter === 'all' ? undefined : filter);
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchResults = async () => {
    try {
      // Fetch match results for all jobs
      const matchPromises = jobs.map(job => 
        aiAPI.getMatch(job.id)
          .then(response => ({ jobId: job.id, data: response.data.match }))
          .catch(() => null) // If no match exists, return null
      );
      
      const results = await Promise.all(matchPromises);
      
      // Build cache object
      const cache = {};
      results.forEach(result => {
        if (result && result.data) {
          cache[result.jobId] = result.data;
        }
      });
      
      setMatchResults(cache);
    } catch (error) {
      console.error('Failed to fetch match results:', error);
    }
  };

  const handleAddJob = async (formData) => {
    try {
      await jobsAPI.create({
        companyName: formData.companyName,
        jobTitle: formData.jobTitle,
        jobDescription: formData.jobDescription,
        jobUrl: formData.jobUrl,
        location: formData.location,
        salaryRange: formData.salaryRange,
        status: formData.status,
        appliedDate: formData.appliedDate,
        notes: formData.notes,
      });
      await fetchJobs();
      setRefreshKey(prev => prev + 1);
      setIsFormOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleEditJob = async (formData) => {
    try {
      await jobsAPI.update(editingJob.id, {
        companyName: formData.companyName,
        jobTitle: formData.jobTitle,
        jobDescription: formData.jobDescription,
        jobUrl: formData.jobUrl,
        location: formData.location,
        salaryRange: formData.salaryRange,
        status: formData.status,
        appliedDate: formData.appliedDate,
        notes: formData.notes,
      });
      await fetchJobs();
      setRefreshKey(prev => prev + 1);
      setIsFormOpen(false);
      setEditingJob(null);
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await jobsAPI.delete(jobId);
      // Remove from cache if exists
      const newCache = { ...matchResults };
      delete newCache[jobId];
      setMatchResults(newCache);
      await fetchJobs();
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('Failed to delete job application');
    }
  };

  const handleAnalyze = async (job) => {
    setSelectedJob(job);
    setIsMatchModalOpen(true);
    
    // Check if we already have results cached
    if (matchResults[job.id]) {
      setMatchResult(matchResults[job.id]);
      return;
    }
    
    // Otherwise, analyze
    setIsAnalyzing(true);
    setMatchResult(null);
    
    try {
      const response = await aiAPI.analyze(job.id);
      const result = response.data.match;
      setMatchResult(result);
      // Cache the result
      setMatchResults(prev => ({ ...prev, [job.id]: result }));
    } catch (error) {
      console.error('Failed to analyze:', error);
      alert(error.response?.data?.error || 'Failed to analyze match. Please try again.');
      setIsMatchModalOpen(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReanalyze = async () => {
    if (!selectedJob) return;
    
    setIsAnalyzing(true);
    try {
      const response = await aiAPI.reanalyze(selectedJob.id);
      const result = response.data.match;
      setMatchResult(result);
      // Update cache
      setMatchResults(prev => ({ ...prev, [selectedJob.id]: result }));
    } catch (error) {
      console.error('Failed to re-analyze:', error);
      alert('Failed to re-analyze match. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingJob(null);
  };

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'applied', label: 'Applied' },
    { value: 'interviewing', label: 'Interviewing' },
    { value: 'offered', label: 'Offered' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'accepted', label: 'Accepted' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Job Applications 📊
          </h2>
          <p className="mt-1 text-gray-600">
            Track and manage your job search journey
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards refresh={refreshKey} />

        {/* Filter Buttons & Add Job */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  filter === f.value
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button 
            onClick={() => {
              setEditingJob(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Job
          </button>
        </div>

        {/* Job List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {filter === 'all' ? 'No applications yet! 🚀' : `No ${filter} applications`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'Start tracking your job applications by adding your first one.'
                  : `You don't have any applications with status "${filter}".`
                }
              </p>
              <button 
                onClick={() => {
                  setEditingJob(null);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Application
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onAnalyze={handleAnalyze}
                onEdit={handleEdit}
                onDelete={handleDelete}
                matchResult={matchResults[job.id]}
              />
            ))}
          </div>
        )}
      </main>

      {/* Job Form Modal */}
      <JobForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingJob ? handleEditJob : handleAddJob}
        initialData={editingJob}
      />

      {/* Match Result Modal */}
      <MatchResultModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        job={selectedJob}
        matchResult={matchResult}
        onReanalyze={handleReanalyze}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
};

export default Dashboard;