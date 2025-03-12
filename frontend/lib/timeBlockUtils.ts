import { Exam, TimeBlock } from '@/types/exam';

/**
 * Get all upcoming time blocks for an exam
 */
export function getUpcomingTimeBlocks(exam: Exam): TimeBlock[] {
  if (!exam.timeBlocks || exam.timeBlocks.length === 0) {
    return [];
  }

  const now = new Date().getTime();
  return exam.timeBlocks
    .filter(block => new Date(block.startTime).getTime() > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

/**
 * Get the next upcoming time block for an exam
 */
export function getNextTimeBlock(exam: Exam): TimeBlock | null {
  const upcomingBlocks = getUpcomingTimeBlocks(exam);
  return upcomingBlocks.length > 0 ? upcomingBlocks[0] : null;
}

/**
 * Get all exams with upcoming sessions
 */
export function getExamsWithUpcomingSessions(exams: Exam[]): Exam[] {
  if (!Array.isArray(exams)) return [];

  return exams
    .filter(exam => getUpcomingTimeBlocks(exam).length > 0)
    .sort((a, b) => {
      const blockA = getNextTimeBlock(a);
      const blockB = getNextTimeBlock(b);

      if (!blockA) return 1;
      if (!blockB) return -1;

      return new Date(blockA.startTime).getTime() - new Date(blockB.startTime).getTime();
    });
}

/**
 * Check if an exam is currently active (has an ongoing session)
 */
export function isExamActive(exam: Exam): boolean {
  if (!exam.timeBlocks || exam.timeBlocks.length === 0) {
    return false;
  }

  const now = new Date().getTime();
  return exam.timeBlocks.some(block => {
    const startTime = new Date(block.startTime).getTime();
    const endTime = new Date(block.endTime).getTime();
    return startTime <= now && endTime >= now;
  });
}

/**
 * Format time blocks for display
 */
export function formatTimeBlockPeriod(block: TimeBlock): string {
  const start = new Date(block.startTime);
  const end = new Date(block.endTime);

  const dateStr = start.toLocaleDateString('en-US', {
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

  return `${dateStr}, ${startTimeStr} - ${endTimeStr}`;
}
