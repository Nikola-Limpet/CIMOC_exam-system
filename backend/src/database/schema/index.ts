import { users } from './users';
import { exams } from './exams';
import { timeBlocks } from './time-blocks';
import { accessKeys } from './access-keys';
import { submissions } from './submissions';
import { questions } from './questions';

// Export all schemas for migrations and schema pushing
export const schema = {
  users,
  exams,
  timeBlocks,
  accessKeys,
  submissions,
  questions,
};