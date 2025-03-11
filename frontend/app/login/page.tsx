'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/auth/auth-form';
import { authApi } from '@/lib/api';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.login(values.email, values.password);
      localStorage.setItem('token', response.data.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return <AuthForm mode="login" onSubmit={handleSubmit} error={error} isLoading={isLoading} />;
}
