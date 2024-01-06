import { Controller, Get } from '@nestjs/common';
import { ReportService } from './services/reports.service';
import { IDashboardStats } from 'src/core/interfaces/dashboard-stats.interface';
import { ICustomResponse } from 'src/core/interfaces/controller-response.interface';

@Controller('report')
export class ReportController {

  constructor(private reportService: ReportService) {}

  @Get('dashboard/stats')
  async getDashboardStats(): Promise<ICustomResponse> {
    const stats = await this.reportService.getDashboardStats();
    return { data: stats };
  }
}
