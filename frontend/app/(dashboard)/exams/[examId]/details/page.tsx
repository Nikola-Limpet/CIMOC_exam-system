'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { isExamActive } from '@/lib/examUtils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Clock, Calendar, File, ArrowLeft, BadgeAlert } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { TakeExamDialog } from '@/components/exams/take-exam-dialog';
import { examService } from '@/services';

export default function ExamDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [takeExamDialogOpen, setTakeExamDialogOpen] = useState(false);

  const { examId } = params as { examId: string };

  const {
    data: exam,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['exam', examId],
    queryFn: () => examService.getExamById(examId),
  });

  console.log('examId', examId);

  console.log(exam);
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-10 w-48" />
        </div>
        <Separator />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BadgeAlert className="h-16 w-16 text-destructive mb-4" />
        <h3 className="text-2xl font-semibold">Failed to load exam details</h3>
        <p className="text-muted-foreground mt-2">
          We couldn't find this exam or you don't have access to it.
        </p>
        <Button className="mt-4" onClick={() => router.push('/exams')}>
          Back to Exams
        </Button>
      </div>
    );
  }

  const examActive = isExamActive(exam);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push('/exams')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Exam Details</h2>
          <p className="text-muted-foreground">View information about this exam</p>
        </div>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{exam.title}</CardTitle>
              {exam.description && (
                <CardDescription className="mt-2">{exam.description}</CardDescription>
              )}
            </div>
            {examActive && (
              <Button
                onClick={() => setTakeExamDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                Take Exam Now
              </Button>
            )}
          </div>
        </CardHeader>

        <Separator className="mx-6" />

        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-2">Exam Information</h3>

                <div className="grid gap-2">
                  {exam.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{exam.duration} minutes duration</span>
                    </div>
                  )}

                  {exam.totalQuestions !== undefined && (
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-muted-foreground" />
                      <span>{exam.totalQuestions} questions</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-lg mb-2">Availability</h3>

                <div className="grid gap-2">
                  {exam.availableFrom && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        From: {format(new Date(exam.availableFrom), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  )}

                  {exam.availableTo && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Until: {format(new Date(exam.availableTo), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg ${
                  examActive
                    ? 'bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-900'
                    : 'bg-yellow-50 border border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-900'
                }`}
              >
                <h3
                  className={`font-medium text-lg ${
                    examActive
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-yellow-700 dark:text-yellow-400'
                  }`}
                >
                  {examActive ? 'Exam is Available' : 'Exam is Not Available'}
                </h3>

                <p
                  className={`mt-1 ${
                    examActive
                      ? 'text-green-600 dark:text-green-300'
                      : 'text-yellow-600 dark:text-yellow-300'
                  }`}
                >
                  {examActive
                    ? 'You can take this exam now.'
                    : exam.availableFrom && new Date(exam.availableFrom) > new Date()
                    ? `This exam will be available from ${format(
                        new Date(exam.availableFrom),
                        'MMM d, yyyy h:mm a'
                      )}`
                    : 'This exam is no longer available.'}
                </p>
              </div>

              {examActive && (
                <div className="bg-blue-50 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-900 p-4 rounded-lg">
                  <h3 className="font-medium text-lg text-blue-700 dark:text-blue-400">
                    Before you start
                  </h3>
                  <ul className="list-disc list-inside mt-1 text-blue-600 dark:text-blue-300">
                    <li>Ensure you have a stable internet connection</li>
                    <li>You will have {exam.duration || 60} minutes to complete this exam</li>
                    <li>You cannot pause the exam once started</li>
                    <li>Your answers are saved automatically as you progress</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => router.push('/exams')}>
            Back to Exams
          </Button>

          {examActive && (
            <Button
              onClick={() => setTakeExamDialogOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              Take This Exam
            </Button>
          )}
        </CardFooter>
      </Card>

      <TakeExamDialog
        isOpen={takeExamDialogOpen}
        exam={exam}
        onClose={() => setTakeExamDialogOpen(false)}
        onProceed={() => router.push(`/exams/${examId}/take`)}
      />
    </div>
  );
}
