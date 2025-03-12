
import { api } from './api';

export interface TimeBlock {
  id?: string;
  availableFrom: string;
  availableTo: string;
  duration?: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  duration?: number;
  totalQuestions?: number;
  status?: 'draft' | 'published' | 'archived';
  participants?: number;
  timeBlocks?: TimeBlock[];
}

export interface ExamFormData {
  title: string;
  description: string;
  duration: number;
  availableFrom: string;
  availableTo: string;
  status: 'draft' | 'published' | 'archived';
  questions?: Question[];
  timeBlocks?: TimeBlock[];
}

export interface Question {
  id?: string;
  text: string;
  image?: string;
  type: 'multiple_choice' | 'single_choice' | 'text';
  options?: { id?: string; text: string; isCorrect: boolean }[];
  correctAnswer?: string;
  marks: number;
}

// Update to match actual API response which returns an array directly
export type ExamsResponse = Exam[];

export const examsApi = {

  // get all exams (with optional pagination/filtering)
  getAll: (queryString = '') => {
    return api.get<ExamsResponse>(`/exams${queryString ? `?${queryString}` : ''}`);
  },

  // Get all exams with pagination and filters
  getExams: (queryString = '') => {
    return api.get<ExamsResponse>(`/exams?${queryString}`);
  },

  // Get a single exam by id
  getExam: (id: string) => {
    return api.get<Exam>(`/exams/${id}`);
  },

  // Create a new exam
  createExam: (examData: ExamFormData) => {
    return api.post<Exam>('/exams', examData);
  },

  // Update an existing exam
  updateExam: (id: string, examData: Partial<ExamFormData>) => {
    return api.put<Exam>(`/exams/${id}`, examData);
  },

  // Delete an exam
  deleteExam: (id: string) => {
    return api.delete(`/exams/${id}`);
  },

  // Add questions to an exam
  addQuestions: (examId: string, questions: Question[]) => {
    return api.post<{ success: boolean }>(`/exams/${examId}/questions`, { questions });
  },

  // Get exam statistics
  getExamStats: (id: string) => {
    return api.get(`/exams/${id}/statistics`);
  },

  // Clone an exam
  cloneExam: (id: string) => {
    return api.post<Exam>(`/exams/${id}/clone`);
  },

  // Change exam status
  changeStatus: (id: string, status: 'draft' | 'published' | 'archived') => {
    return api.patch<Exam>(`/exams/${id}/status`, { status });
  }
};
