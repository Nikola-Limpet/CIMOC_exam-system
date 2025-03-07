import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { GradingService } from './grading.service';
import { GradeSubmissionDto } from './dto/grade-submission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('grading')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class GradingController {
  constructor(private readonly gradingService: GradingService) { }

  @Get('ungraded/:examId')
  getUngradedSubmissions(@Param('examId') examId: string) {
    return this.gradingService.getUngradedSubmissions(examId);
  }

  @Post(':submissionId')
  gradeSubmission(
    @Param('submissionId') submissionId: string,
    @Body() gradeSubmissionDto: GradeSubmissionDto,
    @Req() req,
  ) {
    return this.gradingService.gradeSubmission(submissionId, gradeSubmissionDto, req.user.id);
  }

  @Get('submissions/:examId')
  getSubmissions(
    @Param('examId') examId: string,
    @Query('status') status: 'submitted' | 'graded' | 'all' = 'all',
  ) {
    return this.gradingService.getSubmissionsByStatus(examId, status);
  }

  @Get('statistics/:examId')
  getStatistics(@Param('examId') examId: string) {
    return this.gradingService.getSubmissionStatistics(examId);
  }
}
