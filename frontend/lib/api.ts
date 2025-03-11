import axios from "axios";
import { authApi as authApiModule } from "./api/auth"; // Import the dedicated auth module

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"; // Removed trailing slash

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page or refresh token
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Export the auth API from the dedicated module
export const authApi = authApiModule;

// Exam APIs - updated to use plural form
export const examApi = {
  getAll: () =>
    api.get("/exams"),
  getById: (id: string) =>
    api.get(`/exams/${id}`),
  create: (examData: any) =>
    api.post("/exams", examData),
  update: (id: string, examData: any) =>
    api.patch(`/exams/${id}`, examData),
  delete: (id: string) =>
    api.delete(`/exams/${id}`),
};

// Access Key APIs
export const accessApi = {
  generate: (data: any) =>
    api.post("/access/generate", data),
  validate: (key: string) =>
    api.post("/access/validate", { key }),
  list: (examId?: string) =>
    api.get("/access", { params: { examId } }),
  revoke: (id: string) =>
    api.delete(`/access/${id}`),
};

// Submission APIs
export const submissionApi = {
  create: (data: any) =>
    api.post("/submissions", data),
  getByUser: () =>
    api.get("/submissions/user"),
  getByExam: (examId: string) =>
    api.get(`/submissions/exam/${examId}`),
  getById: (id: string) =>
    api.get(`/submissions/${id}`),
  update: (id: string, data: any) =>
    api.patch(`/submissions/${id}`, data),
};

export const userApi = {
  getCurrentUser: () =>
    api.get("/auth/me"),
  getAll: () =>
    api.get("/users"),
  getById: (id: string) =>
    api.get(`/users/${id}`),
  update: (id: string, userData: any) =>
    api.patch(`/users/${id}`, userData),
  delete: (id: string) =>
    api.delete(`/users/${id}`)
};

export default api;
