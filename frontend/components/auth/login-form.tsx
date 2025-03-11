'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/auth/auth-form';
import { authApi } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import type { LoginCredentials } from '@/lib/api/auth';

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (values: any) => {
    setError('');
    console.log('Login attempt with:', values.email);

    try {
      // Explicitly type the credentials to match the expected interface
      const credentials: LoginCredentials = {
        email: values.email,
        password: values.password,
      };

      const response = await authApi.login(credentials);

      // Extract token - check all possible field names
      const token =
        response.data.accessToken ||
        response.data.token ||
        (response.data.data && (response.data.data.accessToken || response.data.data.token));

      if (!token) {
        console.error('No token found in response', response.data);
        throw new Error('No authentication token received');
      }

      // Extract user data - handle different response structures
      let userData;
      let userRole = null; // Capture the role separately first

      // Option 1: User data in response.data.user
      if (response.data.user) {
        // Check for role in multiple possible locations
        userRole = response.data.user.roles;
        userData = {
          id: response.data.user.id,
          name: response.data.user.name || response.data.user.username || 'User',
          email: response.data.user.email,
          role: userRole[0] || 'student',
        };
      }

      // Option 3: User data in response.data.data
      else if (response.data.data) {
        const dataField = response.data.data;
        userRole = dataField.role || dataField.userRole;
        userData = {
          id: dataField.id,
          name: dataField.name || dataField.username || 'User',
          email: dataField.email,
          role: userRole || 'student',
        };
      } else {
        console.error('User data not found in response', response.data);
        throw new Error('User data not found in response');
      }

      // Set auth state
      login(token, userData);

      startTransition(() => {
        router.push('/dashboard');
      });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || err.message || 'Login failed. Please check your credentials.'
      );
    }
  };

  return <AuthForm mode="login" onSubmit={handleSubmit} error={error} isLoading={isPending} />;
}
