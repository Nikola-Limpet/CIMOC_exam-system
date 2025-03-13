import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { DatabaseService } from '../database/database.service';
import { ExamService } from '../exam/exam.service';
import { CreateAccessKeyDto } from './dto/create-access-key.dto';
import { ValidateAccessKeyDto } from './dto/validate-access-key.dto';

@Injectable()
export class AccessService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly examService: ExamService,
    private readonly configService: ConfigService,
  ) { }

  async generateAccessKey(createAccessKeyDto: CreateAccessKeyDto, adminId: string) {
    const { examId, issuedTo, usageLimit, description } = createAccessKeyDto;

    // Verify the exam exists
    await this.examService.findOne(examId);

    // Generate a random access key
    const keyLength = this.configService.get<number>('ACCESS_KEY_LENGTH', 10);
    const accessKey = randomBytes(Math.ceil(keyLength / 2))
      .toString('hex')
      .slice(0, keyLength)
      .toUpperCase();

    // Store the access key in the database
    const result = await this.databaseService.createAccessKey({
      key: accessKey,
      examId,
      issuedBy: adminId,
      issuedTo,
      usageLimit,
      description
    });

    return result;
  }

  async validateAccessKey(validateDto: ValidateAccessKeyDto) {
    const { accessKey, examId } = validateDto;

    // Find the access key in the database
    const key = await this.databaseService.getAccessKey(accessKey);

    if (!key) {
      throw new NotFoundException('Access key not found');
    }

    // Check if the key is for the requested exam
    if (key.examId !== examId) {
      throw new UnauthorizedException('Access key is not valid for this exam');
    }

    // Check if the key has been revoked
    if (key.revoked) {
      throw new UnauthorizedException('Access key has been revoked');
    }

    // Check if usage limit is reached
    if (key.usageLimit && key.usageCount >= key.usageLimit) {
      throw new UnauthorizedException('Access key usage limit has been reached');
    }

    // Increment the usage count
    await this.databaseService.incrementAccessKeyUsage(key.id);

    // Also check exam availability (time blocks)
    await this.examService.validateExamAccess(examId);

    // Return user info and exam data
    const user = key.issuedTo ? await this.databaseService.getUserById(key.issuedTo) : null;
    const exam = await this.examService.findOne(examId);

    return {
      user,
      exam,
      isValid: true,
    };
  }

  async getAllAccessKeys() {
    return this.databaseService.getAllAccessKeys();
  }

  async getAccessKeysByExam(examId: string) {
    return this.databaseService.getAccessKeysByExam(examId);
  }

  async revokeAccessKey(id: string) {
    const key = await this.databaseService.getAccessKeyById(id);

    if (!key) {
      throw new NotFoundException(`Access key with ID ${id} not found`);
    }

    if (key.revoked) {
      throw new BadRequestException(`Access key ${id} is already revoked`);
    }

    await this.databaseService.revokeAccessKey(id);

    return {
      message: `Access key has been successfully revoked`,
      id,
      key: key.key // Only showing the key for confirmation, not security-critical
    };
  }
}
