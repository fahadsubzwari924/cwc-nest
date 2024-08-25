import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ICustomResponse } from 'src/core/interfaces/controller-response.interface';
import { DateRangeDTO } from '../dtos/date-range.dto';
import { OrderReportsService } from './services/order-reports.service';

@Controller('reports/orders')
export class OrderReportsController {
  constructor(private orderReportsService: OrderReportsService) {}

  @Post('demographics')
  async getCustomerDemographics(
    @Body() dateRange: DateRangeDTO,
  ): Promise<ICustomResponse> {
    const ordersPercentageByProvinces =
      await this.orderReportsService.getOrderPercentageByProvince(dateRange);
    return { data: ordersPercentageByProvinces, metadata: { dateRange } };
  }

  @Get('monthly-orders/:year')
  async getOrdersByMonth(
    @Param('year') year: number,
  ): Promise<ICustomResponse> {
    const ordersByMonth = await this.orderReportsService.getOrdersByMonth(year);
    return { data: ordersByMonth, metadata: { year } };
  }

  @Get('yearly-orders')
  async getOrdersByYear(): Promise<ICustomResponse> {
    const ordersByYear = await this.orderReportsService.getOrderCountByYear();
    return { data: ordersByYear };
  }

  @Get('summary')
  async getOrdersSummary(): Promise<ICustomResponse> {
    const salesSummary = await this.orderReportsService.getOrdersSummary();
    return { data: salesSummary };
  }
}
