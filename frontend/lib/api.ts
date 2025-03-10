import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

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

// Auth APIs
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (userData: any) =>
    api.post("/auth/register", userData),
  profile: () =>
    api.get("/auth/profile"),
};

// Exam APIs
export const examApi = {
  getAll: () =>
    api.get("/exam"),
  getById: (id: string) =>
    api.get(`/exam/${id}`),
  create: (examData: any) =>
    api.post("/exam", examData),
  update: (id: string, examData: any) =>
    api.patch(`/exam/${id}`, examData),
  delete: (id: string) =>
    api.delete(`/exam/${id}`),
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
