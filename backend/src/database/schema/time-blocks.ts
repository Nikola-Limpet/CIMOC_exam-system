import { pgTable, uuid, timestamp, foreignKey, integer } from 'drizzle-orm/pg-core';
import { exams } from './exams';

export const timeBlocks = pgTable('time_blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  examId: uuid('exam_id').references(() => exams.id, { onDelete: 'cascade' }),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  duration: integer('duration'), // Added duration field
  createdAt: timestamp('created_at').defaultNow(),
});

// Types for TypeScript
export type TimeBlock = typeof timeBlocks.$inferSelect;
export type NewTimeBlock = typeof timeBlocks.$inferInsert;