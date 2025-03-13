import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';
import { exams } from './schema/exams';
import { users } from './schema/users';
import { timeBlocks } from './schema/time-blocks';
import { accessKeys } from './schema/access-keys';
import { submissions } from './schema/submissions';
import { questions } from './schema/questions';
import { and, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly drizzleService: DrizzleService
  ) { }

  // User methods
  async getUserById(id: string) {
    return this.drizzleService.findById(users, id);
  }

  async getUserByEmail(email: string) {
    const result = await this.drizzleService.executeQuery(db =>
      db.select().from(users).where(eq(users.email, email)).limit(1)
    );
    return result.length > 0 ? result[0] : null;
  }

  async createUser(userData: any) {
    return this.drizzleService.create(users, userData);
  }

  // Exam methods
  async createExam(examData: any) {
    return this.drizzleService.create(exams, {
      id: uuidv4(),
      ...examData,
    });
  }

  async getAllExams() {
    return this.drizzleService.findAll(exams);
  }

  async getExamById(id: string) {
    return this.drizzleService.findById(exams, id);
  }

  async updateExam(id: string, examData: any) {
    return this.drizzleService.update(exams, id, examData);
  }

  async deleteExam(id: string) {
    return this.drizzleService.delete(exams, id);
  }

  // Time block methods
  async createTimeBlock(timeBlockData: any) {
    return this.drizzleService.create(timeBlocks, {
      id: uuidv4(),
      ...timeBlockData
    });
  }


  async deleteTimeBlocks(examId: string) {
    return this.drizzleService.executeQuery(db =>
      db.delete(timeBlocks).where(eq(timeBlocks.examId, examId))
    );
  }

  // Access key methods
  async createAccessKey(data: {
    examId: string;
    key: string;
    issuedBy: string; // Changed from createdBy
    issuedTo?: string;
    usageLimit?: number | null;
    usageCount?: number;
    description?: string | null;
    revoked?: boolean;
  }) {
    return this.drizzleService.create(accessKeys, {
      id: uuidv4(),
      ...data,
      revoked: data.revoked ?? false,
      createdAt: new Date(),
    });
  }

  // Get access key by ID
  async getAccessKeyById(id: string) {
    return this.drizzleService.executeQuery(db =>
      db.select().from(accessKeys).where(eq(accessKeys.id, id)).limit(1)
    ).then(result => result[0] || null);
  }

  async getAccessKey(key: string) {
    return this.drizzleService.executeQuery(db =>
      db.select().from(accessKeys).where(eq(accessKeys.key, key)).limit(1)
    ).then(result => result[0] || null);
  }


  async incrementAccessKeyUsage(accessKeyId: string) {
    const accessKey = await this.getAccessKeyById(accessKeyId);

    if (!accessKey) {
      throw new NotFoundException(`Access key with ID ${accessKeyId} not found`);
    }

    return this.drizzleService.update(accessKeys, accessKeyId, {
      usageCount: accessKey.usageCount + 1
    });
  }

  async getAccessKeysByExam(examId: string) {
    return this.drizzleService.findByField(accessKeys, accessKeys.examId, examId);
  }

  async getAllAccessKeys() {
    return this.drizzleService.findAll(accessKeys);
  }

  async revokeAccessKey(id: string) {
    return this.drizzleService.update(accessKeys, id, { revoked: true });
  }

  // Question methods
  async createQuestion(questionData: any) {
    return this.drizzleService.create(questions, {
      id: uuidv4(),
      ...questionData
    });
  }

  async getQuestionsByExam(examId: string) {
    return this.drizzleService.findByField(questions, questions.examId, examId);
  }

  async getQuestionById(id: string) {
    return this.drizzleService.findOneById(questions, id);
  }

  async updateQuestion(id: string, questionData: any) {
    return this.drizzleService.update(questions, id, questionData);
  }

  async deleteQuestion(id: string) {
    return this.drizzleService.delete(questions, id);
  }

  async deleteQuestionsByExam(examId: string) {
    return this.drizzleService.executeQuery(db =>
      db.delete(questions).where(eq(questions.examId, examId))
    );
  }

  // Submission methods
  async createSubmission(submissionData: any) {
    return this.drizzleService.create(submissions, {
      id: uuidv4(),
      ...submissionData
    });
  }

  async getSubmissionById(id: string) {
    return this.drizzleService.findById(submissions, id);
  }

  async getSubmissionByUserAndExam(userId: string, examId: string) {
    const result = await this.drizzleService.executeQuery(db =>
      db.select()
        .from(submissions)
        .where(
          and(
            eq(submissions.userId, userId),
            eq(submissions.examId, examId)
          )
        )
        .limit(1)
    );
    return result.length > 0 ? result[0] : null;
  }

  async getSubmissionsByUser(userId: string) {
    return this.drizzleService.findByField(submissions, submissions.userId, userId);
  }

  async getSubmissionsByExam(examId: string) {
    return this.drizzleService.findByField(submissions, submissions.examId, examId);
  }

  async updateSubmission(id: string, data: any) {
    return this.drizzleService.update(submissions, id, data);
  }

  async getUngradedSubmissions(examId: string) {
    return this.drizzleService.executeQuery(db =>
      db.select()
        .from(submissions)
        .where(
          and(
            eq(submissions.examId, examId),
            eq(submissions.status, 'submitted')
          )
        )
    );
  }

  async getSubmissionsByExamAndStatus(examId: string, status: string) {
    return this.drizzleService.executeQuery(db =>
      db.select()
        .from(submissions)
        .where(
          and(
            eq(submissions.examId, examId),
            eq(submissions.status, status)
          )
        )
    );
  }

  async getExamStatistics(examId: string) {
    // This would be a more complex query - simplified example
    const submissions = await this.getSubmissionsByExam(examId);
    const graded = submissions.filter(sub => sub.status === 'graded');

    return {
      totalSubmissions: submissions.length,
      gradedSubmissions: graded.length,
      averageScore: graded.length > 0
        ? graded.reduce((sum, sub) => sum + sub.score, 0) / graded.length
        : 0,
    };
  }
}
