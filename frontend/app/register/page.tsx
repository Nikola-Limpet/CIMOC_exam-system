'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/auth/auth-form';
import { authApi } from '@/lib/api';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    setError('');

    try {
      await authApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      // Redirect to login page after successful registration
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return <AuthForm mode="register" onSubmit={handleSubmit} error={error} isLoading={isLoading} />;
}
