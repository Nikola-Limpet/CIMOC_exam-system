import { IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccessKeyDto {
  @ApiProperty({
    description: 'Exam ID',
    required: true
  })
  @IsUUID()
  examId: string;

  @ApiProperty({
    description: 'User ID this key is issued to (optional)',
    required: false
  })
  @IsOptional()
  @IsUUID()
  issuedTo?: string;

  @ApiProperty({
    description: 'Access key description',
    required: false,
    example: 'For Group A students'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Maximum number of times this key can be used',
    required: false,
    example: 30
  })
  @IsOptional()
  @IsNumber()
  usageLimit?: number;
}