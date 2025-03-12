import { api } from './api';
import { Exam } from '@/types/exam'; // Import from the correct location

// Define a response type if your API returns a wrapper object
interface ExamsResponse {
  data: Exam[];
}

export const examApi = {
  getExams: async () => {
    const response = await api.get('/exams');
    return response.data;
  },

  getExam: async (id: string) => {
    const response = await api.get<{ data: Exam }>(`/exams/${id}`);
    return response.data.data; // Return just the exam object
  },

  createExam: (data: Partial<Exam>) => {
    return api.post<Exam>('/exams', data);
  },

  updateExam: (id: string, data: Partial<Exam>) => {
    return api.put<Exam>(`/exams/${id}`, data);
  },

  deleteExam: (id: string) => {
    return api.delete(`/exams/${id}`);
  }
};
