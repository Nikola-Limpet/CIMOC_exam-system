export interface Exam {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  availableFrom?: string;
  availableTo?: string;
  totalQuestions?: number;
  participants?: number;
  duration?: number;
  timeLimit?: number;
  status?: 'draft' | 'published' | 'archived';
  hasAccess?: boolean;
  timeBlocks?: TimeBlock[];
  accessKey?: string;
  requiresAccessKey?: boolean;
  questions?: Question[];
}

export interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  examId: string;
}

export interface Question {
  id: string;
  examId: string;
  description: string;
  type: 'multiple-choice' | 'true-false' | 'single_choice' | 'short-answer' | 'essay';
  options?: Option[];
  correctAnswer?: string;
  marks?: number;
}

export interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
}

// New interface for access keys
export interface AccessKey {
  id: string;
  examId: string;
  key: string;
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  description?: string;
}
