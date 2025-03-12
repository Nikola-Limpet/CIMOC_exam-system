import axios from 'axios';

// Make sure there's no trailing slash to avoid double slashes in requests
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the JWT token
api.interceptors.request.use(
  (config) => {
    // Only access localStorage when in browser context
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`Adding token to ${config.url} request`);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      console.error('API returned 401 Unauthorized');

      // Only clear token when in browser context and not already on login/register pages
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/register');

        if (!isAuthPage) {
          console.log('Unauthorized request detected, will redirect to login');
          // Don't immediately clear tokens - let the auth provider handle it
        }
      }
    }
    return Promise.reject(error);
  }
);
