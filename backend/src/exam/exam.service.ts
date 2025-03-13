import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { DatabaseService } from '../database/database.service';


@Injectable()
export class ExamService {
  constructor(
    private readonly databaseService: DatabaseService
  ) { }

  async create(createExamDto: CreateExamDto, userId: string) {
    const { title, description, availableFrom, availableTo, ...rest } = createExamDto;

    // Process date fields - convert strings to Date objects
    const examData = {
      title,
      description,
      createdBy: userId,
      ...rest,
      // Convert date strings to Date objects if they exist
      ...(availableFrom && { availableFrom: new Date(availableFrom) }),
      ...(availableTo && { availableTo: new Date(availableTo) }),
    };
    // Insert exam into the database
    const exam = await this.databaseService.createExam(examData);
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

  // Also update the update method
  async update(id: string, updateExamDto: UpdateExamDto) {
    const { availableFrom, availableTo, ...rest } = updateExamDto;

    // Process date fields - convert strings to Date objects
    const examData = {
      ...rest,
      // Convert date strings to Date objects if they exist
      ...(availableFrom && { availableFrom: new Date(availableFrom) }),
      ...(availableTo && { availableTo: new Date(availableTo) }),
    };

    // Update exam details
    await this.databaseService.updateExam(id, examData);
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
    const exam = await this.findOne(examId);

    // Check if the exam is available
    if (exam.availableFrom && new Date(exam.availableFrom) > new Date()) {
      return false;
    }

    if (exam.availableTo && new Date(exam.availableUntil) < new Date()) {
      return false;
    }

    return true;
  }

  async validateExamAccess(examId: string): Promise<void> {
    const isAvailable = await this.validateExamAvailability(examId);

    if (!isAvailable) {
      throw new ForbiddenException('This exam is not currently available');
    }
  }
}
