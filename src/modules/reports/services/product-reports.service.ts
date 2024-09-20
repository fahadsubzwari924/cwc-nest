import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/entities';
import { Repository } from 'typeorm';
import { IReportService, ITopPerformingProductsReport } from '../interfaces';
import { ReportFilters, ReportTypeDto } from '../dtos/order-reports.dto';
import { PRODUCT_REPORT_TYPES, ProductReportType } from '../enums';
import { ProductReportResult } from '../types';

@Injectable()
export class ProductReportsService implements IReportService {
  private reportHandlers: {
    [key in ProductReportType]: (
      reportFilters: ReportFilters,
    ) => Promise<ProductReportType>;
  };

  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {
    this.reportHandlers = {
      [PRODUCT_REPORT_TYPES.TOP_PERFORMING_PRODUCTS]:
        this.getTopTenBestPerformingProducts.bind(this),
    };
  }

  async generateReport(
    reportTypes: Array<ReportTypeDto>,
    reportFilters?: ReportFilters,
  ): Promise<Record<string, ProductReportResult>> {
    const results: Record<string, ProductReportResult> = {};
    for (const reportType of reportTypes) {
      const reportHandler = this.reportHandlers[reportType.name];
      if (reportHandler) {
        results[reportType.name] = await reportHandler(reportFilters);
      } else {
        throw new Error(`Unknown report type: ${reportType}`);
      }
    }

    return results;
  }

  async getTopTenBestPerformingProducts(
    reportFilters?: ReportFilters,
  ): Promise<Array<ITopPerformingProductsReport>> {
    // Extract date range if provided
    const { dateRange } = reportFilters;

    // Construct the query builder
    const query = this.orderItemRepository
      .createQueryBuilder('orderItem') // Alias for the order items table
      .select('product.name', 'productName') // Select the product name
      .addSelect('COUNT(orderItem.id)', 'orderCount') // Count the order items
      .innerJoin('orderItem.product', 'product'); // Join the Product entity

    // Apply the date range filter if provided
    if (dateRange?.startDate && dateRange?.endDate) {
      const startDate = dateRange.startDate;
      const endDate = dateRange.endDate;
      query.where('orderItem.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    // Group by product ID, order by "orderCount" alias, and limit the results to 10
    query
      .groupBy('product.id')
      .orderBy('"orderCount"', 'DESC') // Ensure the alias is in double quotes
      .limit(10);

    const results = await query.getRawMany();

    return results.map((result) => ({
      productName: result.productName,
      orderCount: parseInt(result.orderCount, 10),
    }));
  }
}
