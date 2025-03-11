import { RouteLoader } from "next/dist/client/route-loader";

export interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  examId: string;
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
  timeBlocks: TimeBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  examId: string;
  examTitle: string;
  userId: string;
  status: 'pending' | 'graded';
  score?: number;
  answers: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role;
  createdAt: string;
  updatedAt: string;
}

export enum Role {
  STUDENT = 'student',
  ADMIN = 'admin'
}