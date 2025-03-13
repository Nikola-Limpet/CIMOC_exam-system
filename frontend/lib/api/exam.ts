import { api } from './api';
import { Exam, AccessKey } from '@/types/exam';
import { toAPIDateFormat } from '@/lib/dateUtils';


interface ExamSubmission {
  examId: string;
  answers: Record<string, string | string[]>;
}

// Add proper return type for access key verification
interface AccessVerificationResult {
  valid: boolean;
  message: string;
}

// Add interface for access key generation
interface GenerateAccessKeyResult {
  key: string;
}

/**
 * Format exam data for API submission
 * Ensures dates are in correct ISO format
 */
function formatExamPayload(examData: any): any {
  const formatted = { ...examData };

  // Format date fields to ISO strings for the API
  if (formatted.availableFrom) {
    formatted.availableFrom = toAPIDateFormat(new Date(formatted.availableFrom));
  }

  if (formatted.availableTo) {
    formatted.availableTo = toAPIDateFormat(new Date(formatted.availableTo));
  }

  // Handle time blocks if present
  if (formatted.timeBlocks && Array.isArray(formatted.timeBlocks)) {
    formatted.timeBlocks = formatted.timeBlocks.map((block: any) => ({
      ...block,
      startTime: block.startTime ? toAPIDateFormat(new Date(block.startTime)) : null,
      endTime: block.endTime ? toAPIDateFormat(new Date(block.endTime)) : null
    }));
  }

  return formatted;
}

export const examApi = {
  // Get all exams
  getExams: async () => {
    const response = await api.get('/exams');
    return response.data;
  },

  // Get a single exam by ID
  getExam: async (id: string) => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },


  // Get exam questions by exam ID
  getExamQuestions: async (id: string) => {
    const response = await api.get(`/questions/exam/${id}`);
    return response.data;
  },

  // Verify exam access key with proper typing
  verifyAccessKey: async (id: string, accessKey: string): Promise<AccessVerificationResult> => {
    const response = await api.post(`/exams/${id}/verify-access`, { accessKey });
    return response.data;
  },

  /**
   * Create a new access key for an exam
   * @param examId Exam ID
   * @param options Access key options
   */
  createAccessKey: async (
    examId: string,
    options?: { description?: string; expiresAt?: string; usageLimit?: number }
  ): Promise<AccessKey> => {
    const response = await api.post(`/exams/${examId}/access-keys`, options);
    return response.data;
  },

  // Generate a new access key for an exam (admin only)
  generateAccessKey: async (id: string, options?: {
    description?: string;
    expiresAt?: string;
    usageLimit?: number;
  }): Promise<GenerateAccessKeyResult> => {
    const response = await api.post(`/exams/${id}/access-key`, {
      examId: id,
      ...options
    });
    return response.data;
  },

  // Create a new exam
  createExam: async (examData: any): Promise<Exam> => {
    const formattedData = formatExamPayload(examData);
    return api.post('/exams', formattedData);
  },

  // Update an existing exam
  updateExam: async (id: string, examData: any): Promise<Exam> => {
    const formattedData = formatExamPayload(examData);
    return api.put(`/exams/${id}`, formattedData);
  },

  // Submit exam answers
  submitExam: async (examId: string, answers: Record<string, string | string[]>) => {
    const response = await api.post(`/exams/${examId}/submit`, { answers });
    return response.data;
  },

  // Get exam results
  getExamResults: async (examId: string) => {
    const response = await api.get(`/exams/${examId}/results`);
    return response.data;
  }
};
