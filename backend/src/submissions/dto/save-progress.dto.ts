import { IsNotEmpty, IsUUID, IsObject } from 'class-validator';

export class SaveProgressDto {
  @IsNotEmpty()
  @IsUUID()
  examId: string;

  @IsNotEmpty()
  @IsObject()
  answers: Record<string, string>; // Question ID to answer mapping
}
