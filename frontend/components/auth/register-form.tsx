'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/auth/auth-form';
import { authApi } from '@/lib/api';

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    setError('');

    try {
      await authApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      // Redirect to login page after successful registration
      startTransition(() => {
        router.push('/login?registered=true');
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return <AuthForm mode="register" onSubmit={handleSubmit} error={error} isLoading={isPending} />;
}
