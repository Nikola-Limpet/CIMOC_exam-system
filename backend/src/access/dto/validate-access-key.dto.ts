import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ValidateAccessKeyDto {
  @IsNotEmpty()
  @IsString()
  accessKey: string;

  @IsNotEmpty()
  @IsUUID()
  examId: string;
}
