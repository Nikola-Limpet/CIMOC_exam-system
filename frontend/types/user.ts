export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'user';
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}
