import { api } from './api';

interface User {
  [x: string]: any;
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export const authApi = {
  // Get current user profile
  profile: () => {
    console.log('Fetching user profile');
    return api.get<User>('/auth/me');
  },

  // Login with email and password
  login: async (credentials: LoginCredentials) => {
    console.log('Making login request with:', credentials.email);
    return api.post('/auth/login', credentials);
  },

  // Register new user
  register: (data: RegisterData) => {
    return api.post('/auth/register', data);
  },

  // Request password reset
  forgotPassword: (email: string) => {
    return api.post('/auth/forgot-password', { email });
  },

  // Reset password with token
  resetPassword: (data: ResetPasswordData) => {
    return api.post('/auth/reset-password', data);
  },

  // Update user profile
  updateProfile: (data: Partial<User>) => {
    return api.put<User>('/auth/profile', data);
  },

  // Logout user
  logout: () => {
    return api.post('/auth/logout');
  }
};
