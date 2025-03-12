import { User } from './user';

/**
 * Login credentials for user authentication
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data for creating a new user account
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

/**
 * Authentication response from the API
 */
export interface AuthResponse {
  user: User;
  token: string;
}
