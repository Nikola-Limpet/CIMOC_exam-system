export interface Submission {
  id: string;
  examId: string;
  userId: string;
  status: 'started' | 'completed' | 'graded' | 'pending';
  score?: number;
  startedAt: string;
  completedAt?: string;
  examTitle?: string; // Denormalized for convenience
  userName?: string; // Denormalized for convenience
}
