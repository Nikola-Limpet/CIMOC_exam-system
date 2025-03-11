export interface Exam {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  availableFrom?: string;
  availableTo?: string;
  totalQuestions?: number;
  participants?: number;
  duration?: number;
  status?: 'draft' | 'published' | 'archived';
  hasAccess?: boolean;
}

export interface TimeBlock {
  id?: string;
  startTime: string;
  endTime: string;
  duration?: number;
}
