import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { Skeleton } from '@/components/ui/skeleton';

export default function Login() {
  // Debug message to verify this component is rendering correctly
  console.log('Login page rendering');

  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-3/4 mx-auto" />
    </div>
  );
}
