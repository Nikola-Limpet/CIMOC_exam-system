import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ExamService } from '../exam/exam.service';
import { RedisService } from '../cache/redis.service';
import { GradeSubmissionDto } from './dto/grade-submission.dto';

@Injectable()
export class GradingService {
  private readonly GRADED_SUBMISSION_CACHE_PREFIX = 'graded:';

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly examService: ExamService,
    private readonly redisService: RedisService,
  ) { }

  async getUngradedSubmissions(examId: string) {
    // Validate the exam exists
    await this.examService.findOne(examId);

    // Get submissions that haven't been graded yet
    return this.databaseService.getUngradedSubmissions(examId);
  }

  async gradeSubmission(submissionId: string, gradeDto: GradeSubmissionDto, graderId: string) {
    const { score, feedback, questionScores } = gradeDto;

    // Get the submission
    const submission = await this.databaseService.getSubmissionById(submissionId);
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${submissionId} not found`);
    }

    // Validate the exam exists
    const exam = await this.examService.findOne(submission.examId);

    // Check if the submission was already graded
    if (submission.status === 'graded') {
      throw new BadRequestException('This submission has already been graded');
    }

    // Update the submission with grade information
    const gradedSubmission = await this.databaseService.updateSubmission(submissionId, {
      score,
      feedback,
      questionScores, // Detailed scoring for individual questions
      graderId,
      gradedAt: new Date(),
      status: 'graded',
    });

    // Clear any cache to ensure fresh data
    await this.redisService.delete(`submission:${submissionId}`);

    // Cache the graded submission
    await this.redisService.set(
      `${this.GRADED_SUBMISSION_CACHE_PREFIX}${submissionId}`,
      gradedSubmission,
    );

    return gradedSubmission;
  }

  async getSubmissionsByStatus(examId: string, status: 'submitted' | 'graded' | 'all') {
    // Validate the exam exists
    await this.examService.findOne(examId);

    if (status === 'all') {
      return this.databaseService.getSubmissionsByExam(examId);
    }
    return this.databaseService.getSubmissionsByExamAndStatus(examId, status);
  }

  async getSubmissionStatistics(examId: string) {
    // Validate the exam exists
    await this.examService.findOne(examId);

    // Get statistics for the exam submissions
    const stats = await this.databaseService.getExamStatistics(examId);

    // Cache the statistics
    const cacheKey = `stats:exam:${examId}`;
    await this.redisService.set(cacheKey, stats, 1800); // Cache for 30 minutes

    return stats;
  }
}
