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
  text: string;
  image?: string | null;
  type: QuestionType;
  options?: Option[] | null;
  correctAnswer?: string | null;
  marks?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type QuestionType = 'multiple_choice' | 'single_choice' | 'text';

export interface QuestionWithTime extends Question {
  timeBlockId: string;
}

export interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
}

// New interface for exam answers
export interface ExamAnswer {
  questionId: string;
  answer: string | string[]; // Can be string for text/single choice or string[] for multiple choice
  type: QuestionType;
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
