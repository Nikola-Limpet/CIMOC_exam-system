import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SaveProgressDto } from './dto/save-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createSubmissionDto: CreateSubmissionDto, @Req() req) {
    return this.submissionsService.createSubmission(createSubmissionDto, req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.submissionsService.getSubmission(id);
  }

  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  findUserSubmissions(@Req() req) {
    return this.submissionsService.getUserSubmissions(req.user.id);
  }

  @Get('exam/:examId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findExamSubmissions(@Param('examId') examId: string) {
    return this.submissionsService.getExamSubmissions(examId);
  }

  @Post('progress')
  @UseGuards(JwtAuthGuard)
  saveProgress(@Body() saveProgressDto: SaveProgressDto, @Req() req) {
    return this.submissionsService.saveSubmissionProgress(
      saveProgressDto.examId,
      req.user.id,
      saveProgressDto.answers,
    );
  }

  @Get('progress/:examId')
  @UseGuards(JwtAuthGuard)
  getProgress(@Param('examId') examId: string, @Req() req) {
    return this.submissionsService.getSubmissionProgress(examId, req.user.id);
  }
}
