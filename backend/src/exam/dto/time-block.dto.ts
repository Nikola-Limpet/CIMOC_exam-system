import { IsNotEmpty, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class TimeBlockDto {
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsNumber()
  duration?: number;
}
