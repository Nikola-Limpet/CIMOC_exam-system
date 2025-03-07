import { IsNotEmpty, IsNumber, IsString, IsObject, Min, Max, IsOptional } from 'class-validator';

export class GradeSubmissionDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsObject()
  questionScores?: Record<string, number>; // Question ID to score mapping
}
