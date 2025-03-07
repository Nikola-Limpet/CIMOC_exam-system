import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { DatabaseService } from '../database/database.service';
import { TimeBlock } from './interfaces/time-block.interface';

@Injectable()
export class ExamService {
  constructor(
    private readonly databaseService: DatabaseService
  ) { }

  async create(createExamDto: CreateExamDto, userId: string) {
    const { title, description, timeBlocks, questions, ...rest } = createExamDto;

    // Insert exam into the database
    const exam = await this.databaseService.createExam({
      title,
      description,
      createdBy: userId,
      ...rest
    });

    // Insert time blocks separately
    if (timeBlocks && timeBlocks.length > 0) {
      await Promise.all(
        timeBlocks.map(block =>
          this.databaseService.createTimeBlock({
            examId: exam.id,
            startTime: new Date(block.startTime),
            endTime: new Date(block.endTime)
          })
        )
      );
    }

    // Insert questions separately
    if (questions && questions.length > 0) {
      await Promise.all(
        questions.map(question =>
          this.databaseService.createQuestion({
            examId: exam.id,
            description: question.description,
            imageUrl: question.imageUrl,
            options: question.options,
            correctOption: question.correctOption
          })
        )
      );
    }

    return exam;
  }

  async findAll() {
    return this.databaseService.getAllExams();
  }

  async findOne(id: string) {
    const exam = await this.databaseService.getExamById(id);
    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }
    return exam;
  }

  async update(id: string, updateExamDto: UpdateExamDto) {
    const exam = await this.findOne(id);
    const { timeBlocks, questions, ...examData } = updateExamDto;

    // Update exam details
    await this.databaseService.updateExam(id, examData);

    // If time blocks are provided, update them
    if (timeBlocks) {
      // Delete existing time blocks
      await this.databaseService.deleteTimeBlocks(id);

      // Create new time blocks
      if (timeBlocks.length > 0) {
        await Promise.all(
          timeBlocks.map(block =>
            this.databaseService.createTimeBlock({
              examId: id,
              startTime: new Date(block.startTime),
              endTime: new Date(block.endTime)
            })
          )
        );
      }
    }

    // If questions are provided, update them
    if (questions) {
      // Delete existing questions
      await this.databaseService.deleteQuestionsByExam(id);

      // Create new questions
      if (questions.length > 0) {
        await Promise.all(
          questions.map(question =>
            this.databaseService.createQuestion({
              examId: id,
              description: question.description,
              imageUrl: question.imageUrl,
              options: question.options,
              correctOption: question.correctOption
            })
          )
        );
      }
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const exam = await this.findOne(id);
    // Delete time blocks
    await this.databaseService.deleteTimeBlocks(id);
    // Delete the exam
    await this.databaseService.deleteExam(id);
    return { message: `Exam ${id} has been deleted` };
  }

  async validateExamAvailability(examId: string): Promise<boolean> {
    const now = new Date();
    const timeBlocks = await this.databaseService.getTimeBlocks(examId);

    if (!timeBlocks || timeBlocks.length === 0) {
      // If no time blocks are defined, the exam is always available
      return true;
    }

    // Check if current time is within any time block
    return timeBlocks.some(
      block => now >= new Date(block.startTime) && now <= new Date(block.endTime)
    );
  }

  async validateExamAccess(examId: string): Promise<void> {
    const isAvailable = await this.validateExamAvailability(examId);

    if (!isAvailable) {
      throw new ForbiddenException('This exam is not currently available');
    }
  }

  async getExamQuestions(examId: string) {
    // Validate that the exam exists
    await this.findOne(examId);

    // Get questions for the exam
    return this.databaseService.getQuestionsByExam(examId);
  }
}
