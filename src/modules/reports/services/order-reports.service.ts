import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities';
import { Repository } from 'typeorm';
import {
  IOrderSummaryReport,
  IOrdersByMonthReport,
  IOrdersByYearReport,
  IOrdersPercentageByProvinceReport,
  IReportService,
} from '../interfaces';
import { ReportFilters, ReportTypeDto } from '../dtos/order-reports.dto';
import { ORDER_REPORT_TYPES, OrderReportType } from '../enums';
import { OrderReportResult } from '../types/order-reports.type';
import { IOrderPercentageBySourceReport } from '../interfaces/orders/ordersBySourceReport.interface';

@Injectable()
export class OrderReportsService implements IReportService {
  private reportHandlers: {
    [key in OrderReportType]: (
      reportFilters: ReportFilters,
    ) => Promise<OrderReportResult>;
  };

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {
    this.reportHandlers = {
      [ORDER_REPORT_TYPES.ORDERS_PERCENTAGE_BY_PROVINCE]:
        this.getOrderPercentageByProvince.bind(this),
      [ORDER_REPORT_TYPES.MONTHLY_ORDERS]: this.getOrdersByMonth.bind(this),
      [ORDER_REPORT_TYPES.YEARLY_ORDERS]: this.getOrderCountByYear.bind(this),
      [ORDER_REPORT_TYPES.ORDER_SUMMARY]: this.getOrdersSummary.bind(this),
      [ORDER_REPORT_TYPES.ORDERS_PERCENTAGE_BY_SOURCE]:
        this.getOrderPercentageBySource.bind(this),
    };
  }

  async generateReport(
    reportTypes: Array<ReportTypeDto>,
    reportFilters?: ReportFilters,
  ): Promise<Record<string, OrderReportResult>> {
    const results: Record<string, OrderReportResult> = {};
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

  async getOrderPercentageByProvince(
    reportFilters?: ReportFilters,
  ): Promise<Array<IOrdersPercentageByProvinceReport>> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.customer', 'customer')
      .select('customer.province', 'province')
      .addSelect('COUNT(order.id)', 'orderCount');

    // Apply date filters if provided
    if (reportFilters?.dateRange) {
      const { startDate, endDate } = reportFilters.dateRange;

      if (startDate) {
        queryBuilder.andWhere('order.orderDate >= :startDate', {
          startDate,
        });
      }
      if (endDate) {
        queryBuilder.andWhere('order.orderDate <= :endDate', { endDate });
      }
    }

    queryBuilder.groupBy('customer.province');

    const result = await queryBuilder.getRawMany();

    // Calculate total orders for percentage calculation
    const totalOrders = result.reduce(
      (sum, record) => sum + parseInt(record.orderCount),
      0,
    );

    // Calculate the percentage of orders by province
    return result.map((record) => {
      const orderCount = parseInt(record.orderCount, 10);
      const percentage = totalOrders > 0 ? (orderCount / totalOrders) * 100 : 0;

      // Round to 2 decimal places and keep as number
      const roundedPercentage = Math.round(percentage * 100) / 100;

      return {
        province: record.province,
        orderCount: orderCount,
        percentage: roundedPercentage,
      };
    });
  }

  async getOrdersByMonth(
    reportFilters: ReportFilters,
  ): Promise<Array<IOrdersByMonthReport>> {
    const year = reportFilters.year;

    const ordersByMonthQueryResult = await this.orderRepository.query(
      `
      WITH month_series AS (
        SELECT generate_series(1, 12) AS month_number
      )
      SELECT 
        TO_CHAR(TO_DATE(month_series.month_number::text, 'MM'), 'Month') AS "monthName",
        COALESCE(order_counts."orderCount", 0) AS "orderCount"
      FROM month_series
      LEFT JOIN (
        SELECT EXTRACT(MONTH FROM "order"."orderDate") AS month_number,
               COUNT("order"."id") AS "orderCount"
        FROM "orders" "order"
        WHERE EXTRACT(YEAR FROM "order"."orderDate") = $1
        GROUP BY month_number
      ) AS order_counts ON order_counts.month_number = month_series.month_number
      ORDER BY month_series.month_number
      `,
      [year],
    );

    return ordersByMonthQueryResult.map((result) => ({
      month: result.monthName.trim(),
      orderCount: parseInt(result.orderCount, 10),
    }));
  }

  async getOrderCountByYear(): Promise<Array<IOrdersByYearReport>> {
    // Get the min and max year from the orders table
    const yearRange = await this.orderRepository
      .createQueryBuilder('order')
      .select('MIN(EXTRACT(YEAR FROM order.orderDate))', 'minYear')
      .addSelect('MAX(EXTRACT(YEAR FROM order.orderDate))', 'maxYear')
      .getRawOne();

    const minYear = parseInt(yearRange.minYear, 10);
    const maxYear = parseInt(yearRange.maxYear, 10);

    // Get order counts for each year in the range
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('EXTRACT(YEAR FROM order.orderDate)', 'year')
      .addSelect('COUNT(order.id)', 'orderCount')
      .where(
        'EXTRACT(YEAR FROM order.orderDate) BETWEEN :minYear AND :maxYear',
        { minYear, maxYear },
      )
      .groupBy('year')
      .orderBy('year')
      .getRawMany();

    // Map query results to include all years in the range
    const finalResult = [];
    for (let year = minYear; year <= maxYear; year++) {
      const yearData = result.find((r) => parseInt(r.year) === year);
      finalResult.push({
        year,
        orderCount: yearData ? parseInt(yearData.orderCount) : 0,
      });
    }

    return finalResult;
  }

  async getOrdersSummary(): Promise<Array<IOrderSummaryReport>> {
    // Prepare months array for mapping
    const months = Array.from({ length: 12 }, (_, i) => ({
      monthNumber: i + 1,
      monthName: new Date(2000, i).toLocaleString('default', { month: 'long' }),
    }));

    // Fetch all orders relevant data
    const ordersData = await this.orderRepository
      .createQueryBuilder('order')
      .select('EXTRACT(YEAR FROM order.orderDate)', 'year')
      .addSelect('EXTRACT(MONTH FROM order.orderDate)', 'month')
      .addSelect('COUNT(order.id)', 'orderCount')
      .groupBy('year, month')
      .orderBy('year, month')
      .getRawMany();

    // Process data to get yearly and monthly breakdowns
    const yearMap = new Map<
      number,
      { orderCount: number; months: { [key: number]: number } }
    >();

    for (const row of ordersData) {
      const year = parseInt(row.year);
      const month = parseInt(row.month);
      const orderCount = parseInt(row.orderCount);

      if (!yearMap.has(year)) {
        yearMap.set(year, { orderCount: 0, months: {} });
      }

      const yearData = yearMap.get(year);
      yearData.orderCount += orderCount;
      yearData.months[month] = (yearData.months[month] || 0) + orderCount;
    }

    // Build the final result
    const finalResults = Array.from(yearMap.entries()).map(([year, data]) => {
      return {
        year,
        orderCount: data.orderCount,
        orderByMonths: months.map((month) => ({
          month: month.monthName,
          orderCount: data.months[month.monthNumber] ?? 0,
        })),
      };
    });

    return finalResults;
  }

  async getOrderPercentageBySource(
    reportFilters?: ReportFilters,
  ): Promise<Array<IOrderPercentageBySourceReport>> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.orderSources', 'orderSource')
      .select('orderSource.name', 'sourceName')
      .addSelect('orderSource.type', 'sourceType')
      .addSelect('COUNT(DISTINCT order.id)', 'orderCount')
      .groupBy('orderSource.id')
      .addGroupBy('orderSource.name')
      .addGroupBy('orderSource.type')
      .orderBy('"orderCount"', 'DESC');

    // Apply date filters if provided
    if (reportFilters?.dateRange) {
      const { startDate, endDate } = reportFilters.dateRange;

      if (startDate) {
        queryBuilder.andWhere('order.orderDate >= :startDate', { startDate });
      }
      if (endDate) {
        queryBuilder.andWhere('order.orderDate <= :endDate', { endDate });
      }
    }

    const result = await queryBuilder.getRawMany();

    // Calculate total orders
    const totalOrders = result.reduce(
      (sum, record) => sum + parseInt(record.orderCount),
      0,
    );

    return result.map((record) => {
      const orderCount = parseInt(record.orderCount, 10);
      const percentage = totalOrders > 0 ? (orderCount / totalOrders) * 100 : 0;
      const roundedPercentage = Math.round(percentage * 100) / 100;

      return {
        sourceName: `${record.sourceName}(${record.sourceType})`,
        orderCount: orderCount,
        percentage: roundedPercentage,
      };
    });
  }
}
