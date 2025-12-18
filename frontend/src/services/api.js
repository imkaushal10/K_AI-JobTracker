import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateResume: (resumeText) => api.put('/auth/resume', { resumeText }),
};

// Jobs API calls
export const jobsAPI = {
  create: (jobData) => api.post('/jobs', jobData),
  getAll: (status) => api.get('/jobs', { params: { status } }),
  getOne: (id) => api.get(`/jobs/${id}`),
  update: (id, updates) => api.put(`/jobs/${id}`, updates),
  delete: (id) => api.delete(`/jobs/${id}`),
  getBoard: () => api.get('/jobs/board'),
  getStats: () => api.get('/jobs/stats'),
};

// AI API calls
export const aiAPI = {
  analyze: (jobApplicationId) => api.post('/ai/analyze', { jobApplicationId }),
  getMatch: (jobId) => api.get(`/ai/match/${jobId}`),
  reanalyze: (jobApplicationId) => api.post('/ai/reanalyze', { jobApplicationId }),
};

export default api;