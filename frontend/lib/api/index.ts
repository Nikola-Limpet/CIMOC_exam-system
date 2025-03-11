// Re-export the API instance
import { api } from './api';

// Re-export all API services
export { api };
export { authApi } from './auth';
export { examsApi } from './exams';

// Submission APIs
export const submissionApi = {
  create: (data: any) => api.post("/submissions", data),
  getByUser: () => api.get("/submissions/user"),
  getByExam: (examId: string) => api.get(`/submissions/exam/${examId}`),
  getById: (id: string) => api.get(`/submissions/${id}`),
  update: (id: string, data: any) => api.patch(`/submissions/${id}`, data),
};

// User APIs
export const userApi = {
  getCurrentUser: () => api.get("/auth/me"),
  getAll: () => api.get("/users"),
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, userData: any) => api.patch(`/users/${id}`, userData),
  delete: (id: string) => api.delete(`/users/${id}`)
};

// Access Key APIs
export const accessApi = {
  generate: (data: any) => api.post("/access/generate", data),
  validate: (key: string) => api.post("/access/validate", { key }),
  list: (examId?: string) => api.get("/access", { params: { examId } }),
  revoke: (id: string) => api.delete(`/access/${id}`),
};