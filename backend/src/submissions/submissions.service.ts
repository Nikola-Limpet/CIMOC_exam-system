import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ExamService } from '../exam/exam.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { RedisService } from '../cache/redis.service';

@Injectable()
export class SubmissionsService {
  private readonly SUBMISSION_CACHE_PREFIX = 'submission:';

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly examService: ExamService,
    private readonly redisService: RedisService,
  ) { }

  async createSubmission(createSubmissionDto: CreateSubmissionDto, userId: string) {
    const { examId, answers } = createSubmissionDto;

    // Validate that the exam exists and is currently available
    await this.examService.validateExamAccess(examId);

    // Check if the user already has a submission for this exam
    const existingSubmission = await this.databaseService.getSubmissionByUserAndExam(userId, examId);
    if (existingSubmission) {
      throw new BadRequestException('You have already submitted this exam');
    }

    // Create submission in database
    const submission = await this.databaseService.createSubmission({
      userId,
      examId,
      answers,
      submittedAt: new Date(),
      status: 'submitted', // Initial status
    });

    // Cache the submission
    await this.redisService.set(
      `${this.SUBMISSION_CACHE_PREFIX}${submission.id}`,
      submission,
      3600, // Cache for 1 hour
    );

    return submission;
  }

  async getSubmission(id: string) {
    // Try to get from cache first
    const cachedSubmission = await this.redisService.get(`${this.SUBMISSION_CACHE_PREFIX}${id}`);
    if (cachedSubmission) {
      return cachedSubmission;
    }

    // If not in cache, get from database
    const submission = await this.databaseService.getSubmissionById(id);
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    // Cache the result
    await this.redisService.set(`${this.SUBMISSION_CACHE_PREFIX}${id}`, submission);

    return submission;
  }

  async getUserSubmissions(userId: string) {
    return this.databaseService.getSubmissionsByUser(userId);
  }

  async getExamSubmissions(examId: string) {
    // Validate that the exam exists
    await this.examService.findOne(examId);
    return this.databaseService.getSubmissionsByExam(examId);
  }

  async saveSubmissionProgress(examId: string, userId: string, answers: Record<string, string>) {
    // We use Redis to temporarily store submission progress (autosave)
    const progressKey = `progress:${userId}:${examId}`;

    await this.redisService.set(progressKey, { answers }, 7200); // Store for 2 hours (typical exam duration)

    return { message: 'Progress saved successfully' };
  }

  async getSubmissionProgress(examId: string, userId: string) {
    const progressKey = `progress:${userId}:${examId}`;
    const progress = await this.redisService.get(progressKey);

    if (!progress) {
      return { answers: {} }; // Return empty answers if no progress is found
    }

    return progress;
  }
}
