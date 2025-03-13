import { IsString, IsNotEmpty, IsUUID, isBoolean, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyAccessDto {
  @ApiProperty({
    description: 'Exam ID to verify access for',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  examId: string;

  @ApiProperty({
    description: 'Access key to verify',
    example: 'EXAM-1234-ABCD',
  })
  @IsString()
  @IsNotEmpty()
  accessKey: string;

  @IsBoolean()
  @IsNotEmpty()
  revoke: boolean;
}
