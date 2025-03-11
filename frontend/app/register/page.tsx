import { Suspense } from 'react';
import { RegisterForm } from '@/components/auth/register-form';
import { Skeleton } from '@/components/ui/skeleton';

export default function Register() {
  return (
    <Suspense fallback={<RegisterSkeleton />}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-3/4 mx-auto" />
    </div>
  );
}
