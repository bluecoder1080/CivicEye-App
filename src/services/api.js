import axios from 'axios';
import { CONFIG } from '../../config';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.message);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access detected');
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.log('Server error detected');
    } else if (error.code === 'NETWORK_ERROR') {
      // Handle network errors
      console.log('Network error detected');
    }
    
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Issue management
  async submitIssue(formData) {
    try {
      const response = await api.post('/issues', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit issue');
    }
  },

  async getAllIssues() {
    try {
      const response = await api.get('/issues');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch issues');
    }
  },

  async getResolvedIssues() {
    try {
      const response = await api.get('/issues/resolved');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch resolved issues');
    }
  },

  async getUnresolvedIssues() {
    try {
      const response = await api.get('/issues/unresolved');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch unresolved issues');
    }
  },

  async resolveIssue(issueId) {
    try {
      const response = await api.patch(`/issues/${issueId}/resolve`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to resolve issue');
    }
  },

  // Cloudinary test
  async testCloudinaryConnection() {
    try {
      const response = await api.get('/cloudinary/test');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to test Cloudinary connection');
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      throw new Error('Backend server is not responding');
    }
  },
};

export default api;
