import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptors';
import { ReportsService } from './reports.service';
import {
  CreateReportDto,
  ReportDto,
  ApproveReportDto,
  GetReportDto,
} from './dtos';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/user.decorator';
import { User } from '../users/user.entity';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetReportDto) {
    return this.reportsService.getEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  @Serialize(ReportDto)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(id, body.approved);
  }
}
