import { examApi } from '@/lib/api/exam';
import { Exam, AccessKey, Question } from '@/types/exam';
import { getUpcomingExams, getActiveExams } from '@/lib/examUtils';

export interface AccessVerificationResult {
  valid: boolean;
  message: string;
}

export interface CreateAccessKeyOptions {
  description?: string;
  expiresAt?: string;
  usageLimit?: number;
}

export const examService = {
  /**
   * Get all exams
   * @returns Promise resolving to an array of exams
   */
  getExams: async (): Promise<Exam[]> => {
    try {
      return await examApi.getExams();
    } catch (error) {
      console.error('Error fetching exams:', error);
      throw error;
    }
  },

  /**
   * Get a specific exam by ID
   * @param id Exam ID
   * @returns Promise resolving to an exam
   */
  getExamById: async (id: string): Promise<Exam> => {
    try {
      return await examApi.getExam(id);
    } catch (error) {
      console.error(`Error fetching exam ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get exam questions by exam ID
   * @param id Exam ID
   * @returns Promise resolving to exam questions
   */
  getExamQuestionsByExamId: async (id: string): Promise<Question[]> => {
    try {
      return await examApi.getExamQuestions(id);
    } catch (error) {
      console.error(`Error fetching questions for exam ${id}:`, error);
      throw error;
    }
  },


  /**
   * Verify an exam access key
   * @param id Exam ID
   * @param accessKey Access key provided by the user
   * @returns Promise resolving to verification result
   */
  verifyAccessKey: async (id: string, accessKey: string): Promise<AccessVerificationResult> => {
    try {
      return await examApi.verifyAccessKey(id, accessKey);
    } catch (error: any) {
      console.error(`Error verifying access key for exam ${id}:`, error);

      // Handle specific error status codes
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return { valid: false, message: 'Exam not found' };
        } else if (status === 403) {
          return { valid: false, message: 'Access denied' };
        }
      }

      return { valid: false, message: 'An error occurred during verification' };
    }
  },

  /**
   * Submit exam answers
   * @param id Exam ID
   * @param answers User's answers to exam questions
   * @returns Promise resolving to submission result
   */
  submitExam: async (id: string, answers: Record<string, string | string[]>): Promise<any> => {
    try {
      return await examApi.submitExam(id, answers);
    } catch (error) {
      console.error(`Error submitting exam ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get upcoming exams
   * @returns Promise resolving to an array of upcoming exams
   */
  getUpcomingExams: async (): Promise<Exam[]> => {
    try {
      const exams = await examApi.getExams();

      if (!Array.isArray(exams)) {
        console.error('Expected exams to be an array, got:', typeof exams);
        return [];
      }

      // Use the utility function for getting upcoming exams
      return getUpcomingExams(exams, 3); // Get top 3 upcoming exams
    } catch (error) {
      console.error('Error fetching upcoming exams:', error);
      return []; // Return empty array instead of throwing to prevent UI errors
    }
  },

  /**
   * Get currently active exams
   * @returns Promise resolving to an array of active exams
   */
  getActiveExams: async (): Promise<Exam[]> => {
    try {
      const exams = await examApi.getExams();

      if (!Array.isArray(exams)) {
        return [];
      }

      // Use the utility function for getting active exams
      return getActiveExams(exams);
    } catch (error) {
      console.error('Error fetching active exams:', error);
      return [];
    }
  },

  /**
   * Create a new exam
   * @param examData The exam data to create
   * @returns Promise resolving to the created exam
   */
  createExam: async (examData: any): Promise<Exam> => {
    try {
      return await examApi.createExam(examData);
    } catch (error) {
      console.error('Error creating exam:', error);
      throw error;
    }
  },

  /**
   * Generate a new access key for an exam
   * @param examId The exam ID to generate an access key for
   * @param options Optional settings for the access key
   * @returns Promise resolving to the created access key
   */
  generateAccessKey: async (
    examId: string,
    options?: CreateAccessKeyOptions
  ): Promise<AccessKey> => {
    try {
      return await examApi.createAccessKey(examId, options);
    } catch (error) {
      console.error(`Error generating access key for exam ${examId}:`, error);
      throw error;
    }
  },

};
