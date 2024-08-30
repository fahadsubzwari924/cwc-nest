import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { OrderReportsService } from './services/order-reports.service';
import { ReportRequestDto } from '../dtos/order-reports.dto';
import { REPORT_TYPES } from './enums/report-types.enum';

@Controller('reports/orders')
export class OrderReportsController {
  constructor(private orderReportsService: OrderReportsService) {}

  @Post()
  async getOrdersReport(@Body() reportRequestDto: ReportRequestDto) {
    const { reportType, dateRange, year } = reportRequestDto;

    switch (reportType) {
      case REPORT_TYPES.ORDERS_PERCENTAGE_BY_PROVINCE:
        const ordersByProvinces =
          await this.orderReportsService.getOrderPercentageByProvince(
            dateRange,
          );
        return {
          data: ordersByProvinces,
          metadata: reportRequestDto,
        };

      case REPORT_TYPES.MONTHLY_ORDERS:
        if (!year) {
          throw new BadRequestException(
            'Year is required for this report type',
          );
        }
        const monthlyOrders = await this.orderReportsService.getOrdersByMonth(
          year,
        );
        return {
          data: monthlyOrders,
          metadata: reportRequestDto,
        };

      case REPORT_TYPES.YEARLY_ORDERS:
        const yearlyOrders =
          await this.orderReportsService.getOrderCountByYear();
        return { data: yearlyOrders };

      case REPORT_TYPES.ORDER_SUMMARY:
        const ordersSummary = await this.orderReportsService.getOrdersSummary();
        return { data: ordersSummary };

      default:
        throw new BadRequestException('Invalid report type');
    }
  }
}
