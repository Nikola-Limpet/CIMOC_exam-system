'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Navbar } from './navbar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, refreshUserState } = useAuth();
  const router = useRouter();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Memoize the verification function to prevent unnecessary re-renders
  const verifyAuth = useCallback(async () => {
    try {
      if (isInitialLoad) {
        console.log('Dashboard layout: initial auth check');

        // Check for token before doing anything else
        const hasToken = typeof window !== 'undefined' && localStorage.getItem('token');
        if (!hasToken) {
          console.log('No token found, will redirect to login');
          setIsInitialLoad(false);
          setAuthChecked(true);
          return;
        }

        // Refresh auth state with backend
        await refreshUserState();
        console.log('Auth state refreshed in dashboard layout');
        setIsInitialLoad(false);
        setAuthChecked(true);
      }
    } catch (error) {
      console.error('Error verifying auth in dashboard:', error);
      setIsInitialLoad(false);
      setAuthChecked(true);
    }
  }, [isInitialLoad, refreshUserState]);

  // Force auth verification only once on mount
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  // Handle redirects based on auth state after initial check is complete
  useEffect(() => {
    if (authChecked && !isLoading && !user) {
      console.log('Dashboard: Not authenticated, redirecting to login');
      router.push('/login');
    }
  }, [authChecked, isLoading, user, router]);

  // When loading or during initial verification, show loading state
  if (isLoading || isInitialLoad || !authChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800 animate-pulse">
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render the protected content
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto p-4">{children}</div>
    </div>
  );
}
