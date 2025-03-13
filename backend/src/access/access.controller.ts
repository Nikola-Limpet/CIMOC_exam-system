import { Controller, Post, Body, Get, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { AccessService } from './access.service';
import { CreateAccessKeyDto } from './dto/create-access-key.dto';
import { ValidateAccessKeyDto } from './dto/validate-access-key.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) { }

  @Post('generate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  generateKey(@Body() createAccessKeyDto: CreateAccessKeyDto, @Req() req) {
    return this.accessService.generateAccessKey(createAccessKeyDto, req.user.id);
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  validateKey(@Body() validateAccessKeyDto: ValidateAccessKeyDto) {
    return this.accessService.validateAccessKey(validateAccessKeyDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  listKeys(@Query('examId') examId?: string) {
    return this.accessService.getAccessKeysByExam(examId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  revokeKey(@Param('id') id: string) {
    return this.accessService.revokeAccessKey(id);
  }
}
