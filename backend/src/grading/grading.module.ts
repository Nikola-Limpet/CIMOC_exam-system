import { Module } from '@nestjs/common';
import { GradingController } from './grading.controller';
import { GradingService } from './grading.service';
import { DatabaseModule } from '../database/database.module';
import { ExamModule } from '../exam/exam.module';
import { CacheModule } from '../cache/cache.module';
import { SubmissionsModule } from '../submissions/submissions.module';

@Module({
  imports: [DatabaseModule, ExamModule, CacheModule, SubmissionsModule],
  controllers: [GradingController],
  providers: [GradingService],
})
export class GradingModule { }
