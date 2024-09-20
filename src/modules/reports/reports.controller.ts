import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReportService } from './services/reports.service';
import { ICustomResponse } from 'src/core/interfaces/controller-response.interface';
import { ReportRequestDto } from './dtos/order-reports.dto';
import { groupBy, map, uniq } from 'lodash';
import { ReportServiceRegistry } from './services/report-service.registry';

@Controller('reports')
export class ReportController {
  constructor(
    private reportService: ReportService,
    private readonly reportServiceRegistry: ReportServiceRegistry,
  ) {}

  @Post()
  async getReport(@Body() reportRequestDto: ReportRequestDto) {
    const { reportTypes, filters } = reportRequestDto;
    const reportResults = {};

    const reportCategories = uniq(map(reportTypes, 'category'));
    const reportTypesByCategory = groupBy(reportTypes, 'category');

    for (const reportCategory of reportCategories) {
      const reportService =
        this.reportServiceRegistry.getService(reportCategory);
      const data = await reportService.generateReport(
        reportTypesByCategory[reportCategory],
        filters,
      );
      reportResults[reportCategory] = data;
    }

    return { data: reportResults, metadata: reportRequestDto };
  }

  @Get('dashboard/stats')
  async getDashboardStats(): Promise<ICustomResponse> {
    const stats = await this.reportService.getDashboardStats();
    return { data: stats };
  }
}
