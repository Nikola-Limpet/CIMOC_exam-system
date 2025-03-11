'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUserState: () => Promise<void>;
}

// Create context outside of component to prevent recreation
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Separate the hook from the provider to prevent Fast Refresh issues
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Use useCallback to prevent recreation of this function on each render
  const refreshUserState = useCallback(async () => {
    if (typeof window === 'undefined') return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      console.log('Token found in localStorage:', !!token);

      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Try to restore user from localStorage first for faster loading
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        try {
          const userData = JSON.parse(cachedUser);
          setUser(userData);
          console.log('Auth state restored from localStorage:', userData);
        } catch (e) {
          console.error('Failed to parse cached user data:', e);
        }
      }

      // Verify token with backend
      try {
        console.log('Verifying token with API...');
        const { data } = await authApi.profile();
        console.log('API response:', data);

        // Convert response to User format
        const userData = {
          id: data.id || data.user?.id,
          name: data.name || data.user?.name || data.username || data.user?.username || 'User',
          email: data.email || data.user?.email,
          roles: Array.isArray(data.roles)
            ? data.roles[0]
            : data.role || data.user?.roles || 'student',
        };

        console.log('User data extracted:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } catch (apiError) {
        console.error('Failed to validate token with API:', apiError);

        // IMPORTANT: Only clear tokens if it's a 401/403 error
        // if (
        //   apiError.response &&
        //   (apiError.response.status === 401 || apiError.response.status === 403)
        // ) {
        //   console.log('Auth token invalid - clearing data');
        //   localStorage.removeItem('token');
        //   localStorage.removeItem('user');
        //   setUser(null);
        // } else {
        //   // For other errors (network, etc), keep the token and use cached data
        //   console.log('Non-auth API error - keeping cached data');
        // }
      }
    } catch (error) {
      console.error('Auth state refresh error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((token: string, userData: User) => {
    console.log('Setting auth token and user data:', { token: !!token, userData });

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  }, [router]);

  // Load auth state on initial mount only
  useEffect(() => {
    console.log('Auth provider mounted, checking auth state');
    refreshUserState();
  }, [refreshUserState]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = {
    user,
    isLoading,
    login,
    logout,
    refreshUserState,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
