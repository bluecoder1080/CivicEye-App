// Configuration file for CivicEye React Native App
// Note: Replace with your actual credentials from .env file

export const CONFIG = {
  // Backend API Configuration
  API_BASE_URL: __DEV__ 
    ? 'http://10.0.2.2:5000/api'  // Android emulator
    : 'https://civic-eye-backend.onrender.com/api',
  
  // For iOS simulator, use: http://localhost:5000/api
  // For physical device, use your computer's IP: http://192.168.1.XXX:5000/api
  
  // Cloudinary Configuration
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloudinary_cloud_name_here',
    API_KEY: process.env.CLOUDINARY_API_KEY || 'your_cloudinary_api_key_here',
    API_SECRET: process.env.CLOUDINARY_API_SECRET || 'your_cloudinary_api_secret_here',
    UPLOAD_PRESET: 'civic_eye_uploads' // Create this in Cloudinary dashboard
  },

  // MongoDB Configuration (backend only)
  MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://username:password@cluster.mongodb.net/civic-issues',

  // App Configuration
  APP: {
    NAME: 'CivicEye',
    VERSION: '1.0.0',
    DESCRIPTION: 'Report and track civic issues in your community'
  },

  // Location Services
  LOCATION: {
    TIMEOUT: 15000,
    MAXIMUM_AGE: 60000,
    ENABLE_HIGH_ACCURACY: true
  },

  // Image Configuration
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    QUALITY: 0.8,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg']
  }
};

// Development flag
export const IS_DEV = __DEV__;

// API endpoints
export const ENDPOINTS = {
  ISSUES: '/issues',
  ISSUES_RESOLVED: '/issues/resolved',
  ISSUES_UNRESOLVED: '/issues/unresolved',
  RESOLVE_ISSUE: (id) => `/issues/${id}/resolve`,
  CLOUDINARY_TEST: '/cloudinary/test'
};
