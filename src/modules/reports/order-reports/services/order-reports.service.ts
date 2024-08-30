import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities';
import { Repository } from 'typeorm';
import { IDateRange } from '../../interfaces/dateRange.interface';
import {
  IOrderSummaryReport,
  IOrdersByMonthReport,
  IOrdersByYearReport,
  IOrdersPercentageByProvinceReport,
} from '../interfaces';

@Injectable()
export class OrderReportsService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getOrderPercentageByProvince(
    dateRange: IDateRange,
  ): Promise<Array<IOrdersPercentageByProvinceReport>> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.customer', 'customer')
      .select('customer.province', 'province')
      .addSelect('COUNT(order.id)', 'orderCount');

    // Apply date filters if provided
    if (dateRange) {
      const { startDate, endDate } = dateRange;

      if (startDate) {
        queryBuilder.andWhere('order.created_at >= :startDate', { startDate });
      }
      if (endDate) {
        queryBuilder.andWhere('order.created_at <= :endDate', { endDate });
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

  async getOrdersByMonth(year: number): Promise<Array<IOrdersByMonthReport>> {
    const months = Array.from({ length: 12 }, (_, i) => ({
      monthNumber: i + 1,
      monthName: new Date(2000, i).toLocaleString('default', { month: 'long' }),
    }));

    const ordersByMonthQueryResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('EXTRACT(MONTH FROM order.orderDate)', 'month')
      .addSelect('COUNT(order.id)', 'orderCount')
      .where('EXTRACT(YEAR FROM order.orderDate) = :year', { year })
      .groupBy('month')
      .orderBy('month')
      .getRawMany();

    const ordersByMonth = months.map((month) => {
      const monthData = ordersByMonthQueryResult.find(
        (r) => parseInt(r.month) === month.monthNumber,
      );
      return {
        month: month.monthName,
        orderCount: monthData ? parseInt(monthData.orderCount) : 0,
      };
    });

    return ordersByMonth;
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
          orderCount: data.months[month.monthNumber] || 0,
        })),
      };
    });

    return finalResults;
  }
}
