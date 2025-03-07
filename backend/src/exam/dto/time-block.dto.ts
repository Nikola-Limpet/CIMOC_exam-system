import { IsNotEmpty, IsDateString } from 'class-validator';

export class TimeBlockDto {
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;
}
