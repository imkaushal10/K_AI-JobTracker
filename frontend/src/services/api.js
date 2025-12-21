import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 second timeout for cold starts
});

// Track pending requests
let pendingRequests = 0;

// Request interceptor to add token and handle loading
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Increment pending requests
    pendingRequests++;
    
    // Show loading for first request (likely cold start)
    if (pendingRequests === 1) {
      const event = new CustomEvent('api-loading', { 
        detail: { loading: true, message: 'Connecting to server...' } 
      });
      window.dispatchEvent(event);
    }
    
    return config;
  },
  (error) => {
    pendingRequests--;
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and loading
api.interceptors.response.use(
  (response) => {
    // Decrement pending requests
    pendingRequests--;
    
    // Hide loading when all requests complete
    if (pendingRequests === 0) {
      const event = new CustomEvent('api-loading', { 
        detail: { loading: false } 
      });
      window.dispatchEvent(event);
    }
    
    return response;
  },
  (error) => {
    // Decrement pending requests
    pendingRequests--;
    
    // Hide loading
    if (pendingRequests === 0) {
      const event = new CustomEvent('api-loading', { 
        detail: { loading: false } 
      });
      window.dispatchEvent(event);
    }
    
    // Only redirect on 401 if it's NOT a login/register request
    const isLoginOrRegister = error.config?.url?.includes('/auth/login') || 
                              error.config?.url?.includes('/auth/register');
    
    if (error.response?.status === 401 && !isLoginOrRegister) {
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