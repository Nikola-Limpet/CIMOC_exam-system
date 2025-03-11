export interface TimeBlock {
  id: string;
  examId: string;
  startTime: Date;
  endTime: Date;
  duration?: number; // Added duration field
}
