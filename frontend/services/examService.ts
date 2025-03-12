import { examApi } from '@/lib/api/exam';
import { Exam } from '@/types/exam';
import { getUpcomingExams, getActiveExams } from '@/lib/examUtils';

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
  }
};
