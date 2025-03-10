export interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  examId: string;
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
  timeBlocks: TimeBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  examId: string;
  examTitle: string;
  userId: string;
  status: 'pending' | 'graded';
  score?: number;
  answers: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  createdAt: string;
  updatedAt: string;
}
