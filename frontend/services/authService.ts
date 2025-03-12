import { User } from '@/types/user';
import { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';
import { ApiResponse } from '@/types/api';
import { api } from '@/lib/api/api';

// Create authApi with the new types
const authApi = {
  login: (credentials: LoginCredentials) => {
    return api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
  },

  register: (data: RegisterData) => {
    return api.post<ApiResponse<User>>('/auth/register', data);
  },

  profile: () => {
    return api.get<ApiResponse<User>>('/auth/profile');
  },

  logout: () => {
    return api.post<ApiResponse<null>>('/auth/logout', {});
  }
};

export const authService = {
  /**
   * Log in a user
   * @param credentials User login credentials
   * @returns Promise resolving to the authenticated user and token
   */
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    try {
      const response = await authApi.login(credentials);
      return response.data.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Promise resolving to the registered user
   */
  register: async (userData: RegisterData): Promise<User> => {
    try {
      const response = await authApi.register(userData);
      return response.data.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Get the current user profile
   * @returns Promise resolving to the user profile
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await authApi.profile();
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Log out the current user
   */
  logout: async (): Promise<void> => {
    try {
      await authApi.logout();
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};
