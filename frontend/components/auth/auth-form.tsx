'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Login schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

// Register schema
const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

type FormMode = 'login' | 'register';

interface AuthFormProps {
  mode: FormMode;
  onSubmit: (values: LoginFormValues | RegisterFormValues) => Promise<void>;
  error?: string;
  isLoading?: boolean;
}

export function AuthForm({ mode, onSubmit, error, isLoading = false }: AuthFormProps) {
  const schema = mode === 'login' ? loginSchema : registerSchema;
  // Local loading state that can be immediately set
  const [localLoading, setLocalLoading] = useState(false);

  // Sync local loading state with prop
  useEffect(() => {
    if (!isLoading) {
      // When parent marks loading as done, update local state
      setLocalLoading(false);
    }
  }, [isLoading]);

  // Setup react-hook-form
  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === 'login'
        ? { email: '', password: '' }
        : { name: '', email: '', password: '', confirmPassword: '' },
  });

  // Handle form submission
  const handleSubmit = async (values: any) => {
    // Immediately set local loading state
    setLocalLoading(true);

    // Call parent's submit handler
    await onSubmit(values);
  };

  // Use combined loading state (local or parent)
  const showLoading = localLoading || isLoading;

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#343A40] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-lg">
          <div className="text-center mb-8">
            <motion.h1
              className="text-3xl font-bold text-[#2E3A59] dark:text-white"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </motion.h1>
            <p className="text-[#6C7A89] dark:text-gray-300 mt-2">
              {mode === 'login'
                ? 'Sign in to continue to your account'
                : 'Join our platform to start your journey'}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="mb-6 border-red-400 text-red-800 dark:text-red-300 bg-red-50 dark:bg-red-900/30">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {mode === 'register' && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        type="email"
                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>
                      {mode === 'login' && (
                        <Link
                          href="/forgot-password"
                          className="text-sm text-[#2D9C92] hover:underline"
                        >
                          Forgot Password?
                        </Link>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {mode === 'register' && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              )}

              <Button
                type="submit"
                className="bg-[#2D9C92] hover:bg-[#24857D] text-white w-full"
                disabled={showLoading}
              >
                {showLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'login' ? 'Signing in...' : 'Creating Account...'}
                  </>
                ) : mode === 'login' ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-[#6C7A89] dark:text-gray-300">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <Link
                href={mode === 'login' ? '/register' : '/login'}
                className="text-[#2D9C92] hover:underline"
              >
                {mode === 'login' ? 'Create Account' : 'Sign In'}
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
