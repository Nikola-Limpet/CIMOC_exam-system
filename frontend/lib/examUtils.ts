import { Exam } from '@/types/exam';

/**
 * Check if an exam is currently active
 */
export function isExamActive(exam: Exam): boolean {
  if (!exam.availableFrom || !exam.availableTo) return false;

  const now = new Date().getTime();
  const startTime = new Date(exam.availableFrom).getTime();
  const endTime = new Date(exam.availableTo).getTime();

  return startTime <= now && endTime >= now;
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
