import { Module } from '@nestjs/common';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';
import { DatabaseModule } from '../database/database.module';
import { ExamModule } from '../exam/exam.module';

@Module({
  imports: [DatabaseModule, ExamModule],
  controllers: [AccessController],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule { }
