import { Exam, Question, ExamAnswer } from '@/types/exam';
import { formatDistanceToNow, isPast, isFuture } from 'date-fns';

/**
 * Check if an exam is currently active
 */
export function isExamActive(exam: Exam): boolean {
  if (!exam) return false;

  const now = new Date();
  const startDate = exam.availableFrom ? new Date(exam.availableFrom) : null;
  const endDate = exam.availableTo ? new Date(exam.availableTo) : null;

  // If no dates are specified, assume the exam is always available
  if (!startDate && !endDate) return true;

  // If only start date is specified, check if it's past
  if (startDate && !endDate) return isPast(startDate);

  // If only end date is specified, check if it's future
  if (!startDate && endDate) return isFuture(endDate);

  // If both dates are specified, check if now is between them
  return isPast(startDate) && isFuture(endDate);
}

/**
 * Check if an exam is upcoming
 */
export function isExamUpcoming(exam: Exam): boolean {
  if (!exam.availableFrom) return false;

  const now = new Date().getTime();
  const startTime = new Date(exam.availableFrom).getTime();

  return startTime > now;
}

/**
 * Check if an exam has expired
 */
export function isExamExpired(exam: Exam): boolean {
  if (!exam.availableTo) return false;

  const now = new Date().getTime();
  const endTime = new Date(exam.availableTo).getTime();

  return endTime < now;
}

/**
 * Format exam availability period for display
 */
export function formatExamPeriod(exam: Exam): string {
  if (!exam.availableFrom || !exam.availableTo) {
    return 'No availability set';
  }

  const start = new Date(exam.availableFrom);
  const end = new Date(exam.availableTo);

  const startDateStr = start.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const endDateStr = end.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const startTimeStr = start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const endTimeStr = end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Same day
  if (startDateStr === endDateStr) {
    return `${startDateStr}, ${startTimeStr} - ${endTimeStr}`;
  }

  // Different days
  return `${startDateStr}, ${startTimeStr} - ${endDateStr}, ${endTimeStr}`;
}

/**
 * Sort exams by availability date
 */
export function sortExamsByDate(exams: Exam[]): Exam[] {
  if (!Array.isArray(exams)) return [];

  return [...exams].sort((a, b) => {
    if (!a.availableFrom) return 1;
    if (!b.availableFrom) return -1;

    return new Date(a.availableFrom).getTime() - new Date(b.availableFrom).getTime();
  });
}

/**
 * Get upcoming exams
 */
export function getUpcomingExams(exams: Exam[], limit?: number): Exam[] {
  if (!Array.isArray(exams)) return [];

  const upcomingExams = exams
    .filter(isExamUpcoming)
    .sort((a, b) => {
      const aTime = a.availableFrom ? new Date(a.availableFrom).getTime() : Infinity;
      const bTime = b.availableFrom ? new Date(b.availableFrom).getTime() : Infinity;
      return aTime - bTime;
    });

  return limit ? upcomingExams.slice(0, limit) : upcomingExams;
}

/**
 * Get active exams
 */
export function getActiveExams(exams: Exam[]): Exam[] {
  if (!Array.isArray(exams)) return [];
  return exams.filter(isExamActive);
}

/**
 * Gets the exam duration in minutes, handling potential inconsistencies
 * between timeLimit and duration properties
 */
export function getExamDuration(exam: Exam): number {
  // Return the first defined value, defaulting to 60 minutes
  return exam.timeLimit || exam.duration || 60;
}

/**
 * Format the remaining time for an exam
 */
export function formatExamTimeRemaining(exam: Exam): string {
  if (!exam.availableTo) return 'No end date specified';

  const endDate = new Date(exam.availableTo);
  if (isPast(endDate)) return 'Exam has ended';

  return `Ends ${formatDistanceToNow(endDate, { addSuffix: true })}`;
}

/**
 * Format the remaining time in HH:MM:SS format
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return '00:00:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
}

/**
 * Calculate the progress of an exam based on answered questions
 */
export function calculateExamProgress(questions: Question[], answers: ExamAnswer[]): number {
  if (!questions?.length) return 0;

  // Count non-empty answers
  const answeredCount = answers.filter(answer => {
    if (Array.isArray(answer.answer)) {
      return answer.answer.length > 0;
    }
    return answer.answer !== undefined && answer.answer !== '';
  }).length;

  return Math.round((answeredCount / questions.length) * 100);
}

/**
 * Calculate the total marks for an exam
 */
export function calculateTotalMarks(questions: Question[]): number {
  if (!questions?.length) return 0;
  return questions.reduce((total, q) => total + (q.marks || 0), 0);
}
