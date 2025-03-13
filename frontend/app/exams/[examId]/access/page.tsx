'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LockKeyhole, Key } from 'lucide-react';
import { ExamAccessForm } from '@/components/exam/exam-access-form';
import { useExamAccess } from '@/hooks/useExamAccess';

export default function ExamAccessPage() {
  const { examId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { exam, loading, hasAccess, examIsActive } = useExamAccess(examId as string);

  // Redirect if user already has access or if exam doesn't require an access key
  if (hasAccess && examId) {
    router.replace(`/exams/${examId}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading exam information...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <LockKeyhole className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Exam Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find the exam you're looking for.</p>
        <Button onClick={() => router.push('/exams')}>Browse Exams</Button>
      </div>
    );
  }

  if (!examIsActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <LockKeyhole className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Exam Not Available</h2>
        <p className="text-muted-foreground mb-6">
          This exam is not currently available for taking.
        </p>
        <Button onClick={() => router.push('/exams')}>Browse Exams</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border shadow-md">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-6">
              <div className="p-3 rounded-full bg-primary/10">
                <Key className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center">Exam Access</h1>
            <p className="text-center text-muted-foreground">
              Enter the access key to start the exam:{' '}
              <span className="font-medium">{exam.title}</span>
            </p>
          </CardHeader>
          <CardContent>
            <ExamAccessForm
              examId={examId as string}
              onSuccess={() => router.push(`/exams/${examId}`)}
            />
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <div className="text-xs text-muted-foreground text-center w-full">
              <p>Having trouble? Contact your instructor or administrator.</p>
            </div>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => router.back()}>
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
