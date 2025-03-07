import { IsNotEmpty, IsUUID, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubmissionDto {
  @IsNotEmpty()
  @IsUUID()
  examId: string;

  @IsNotEmpty()
  @IsObject()
  answers: Record<string, string>; // Question ID to answer mapping
}
