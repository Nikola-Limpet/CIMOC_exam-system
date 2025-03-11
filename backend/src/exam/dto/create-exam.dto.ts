import {
  IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested,
  IsEnum, IsNumber, IsDateString
} from 'class-validator';
import { Type } from 'class-transformer';
import { TimeBlockDto } from './time-block.dto';
import { QuestionDto } from './question.dto';

export class CreateExamDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsDateString()
  availableFrom?: string;

  @IsOptional()
  @IsDateString()
  availableTo?: string;

  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeBlockDto)
  timeBlocks?: TimeBlockDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions?: QuestionDto[];
}
