import { Module } from '@nestjs/common';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { DatabaseModule } from '../database/database.module';
import { ExamModule } from '../exam/exam.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [DatabaseModule, ExamModule, CacheModule],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule { }
