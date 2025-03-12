import { api } from '@/lib/api/api';
import { User } from '@/types/user';

export const userService = {
  /**
   * Get the current authenticated user
   * @returns Promise resolving to the current user
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      const { data } = await api.get<{ data: User }>('/auth/profile');
      return data.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  /**
   * Get all users (typically for admin)
   * @returns Promise resolving to an array of users
   */
  getAllUsers: async (): Promise<User[]> => {
    try {
      const { data } = await api.get<{ data: User[] }>('/users');
      return data.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }
};
