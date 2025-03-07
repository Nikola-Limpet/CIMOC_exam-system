import { IsNotEmpty, IsString, IsUUID, IsOptional, IsDateString } from 'class-validator';

export class CreateAccessKeyDto {
  @IsNotEmpty()
  @IsUUID()
  examId: string;

  @IsNotEmpty()
  @IsUUID()
  issuedTo: string; // User ID to whom the key is issued

  @IsOptional()
  @IsDateString()
  expiresAt?: string; // Optional expiration date
}
