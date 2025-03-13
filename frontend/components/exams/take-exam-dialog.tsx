'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Exam } from '@/types/exam';
import { Clock, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TakeExamDialogProps {
  isOpen: boolean;
  exam: Exam | null;
  onClose: () => void;
  onProceed: () => void;
}

export function TakeExamDialog({ isOpen, exam, onClose, onProceed }: TakeExamDialogProps) {
  if (!exam) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Begin Exam: {exam.title}</DialogTitle>
          <DialogDescription>
            You are about to start this exam. Please make sure you're ready before proceeding.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">Exam Details</p>
            {exam.description && (
              <p className="text-sm text-muted-foreground">{exam.description}</p>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{exam.duration || exam.timeLimit || 60} minutes duration</span>
            </div>

            {exam.availableTo && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Available until{' '}
                  {formatDistanceToNow(new Date(exam.availableTo), { addSuffix: true })}
                </span>
              </div>
            )}

            {exam.totalQuestions !== undefined && (
              <div className="bg-muted/50 p-2 rounded-md text-sm">
                <p>Total questions: {exam.totalQuestions}</p>
              </div>
            )}
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 p-3 rounded-md">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
              Important information
            </p>
            <ul className="list-disc list-inside mt-1 text-xs text-yellow-700 dark:text-yellow-300">
              <li>Once started, the exam timer cannot be paused</li>
              <li>Ensure you have a stable internet connection</li>
              <li>Do not refresh or close the browser during the exam</li>
              <li>Your answers are automatically saved as you progress</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onProceed}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          >
            Start Exam
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
