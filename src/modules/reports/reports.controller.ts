import { Controller, Get } from '@nestjs/common';
import { ReportService } from './services/reports.service';
import { ICustomResponse } from 'src/core/interfaces/controller-response.interface';

@Controller('reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get('dashboard/stats')
  async getDashboardStats(): Promise<ICustomResponse> {
    const stats = await this.reportService.getDashboardStats();
    return { data: stats };
  }
}
