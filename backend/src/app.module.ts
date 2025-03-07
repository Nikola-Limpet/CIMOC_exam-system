import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ExamModule } from './exam/exam.module';
import { AccessModule } from './access/access.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { GradingModule } from './grading/grading.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Import DatabaseModule first, since it's used by other modules
    DatabaseModule,
    // Then import modules that depend on DatabaseModule
    ExamModule,
    AuthModule,
    AccessModule,
    SubmissionsModule,
    GradingModule,
    CacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
