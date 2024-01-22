import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReportService } from './services/reports.service';
import { ICustomResponse } from 'src/core/interfaces/controller-response.interface';
import { OrderByCityDTO } from './dtos/orders-by-city.dto';
import { DateUtil } from 'src/utils/date.util';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get('dashboard/stats')
  async getDashboardStats(): Promise<ICustomResponse> {
    const stats = await this.reportService.getDashboardStats();
    return { data: stats };
  }
  @Post('ordersByCities')
  async getOrdersByCities(
    @Body() orderDates: OrderByCityDTO,
  ): Promise<ICustomResponse> {
    if (
      DateUtil.isFutureDate(orderDates.startDate) ||
      DateUtil.isFutureDate(orderDates.endDate)
    ) {
      return {
        data: [],
        metadata: {
          error: {
            messgae:
              'Start Date or End Date can not be greater than today`s date',
          },
        },
      };
    }

    const stats = await this.reportService.getOrderByCities(
      orderDates.startDate,
      orderDates.endDate,
    );
    return { data: stats };
  }
}
