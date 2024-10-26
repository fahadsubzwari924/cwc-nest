import { InjectRepository } from '@nestjs/typeorm';
import { IDashboardStats } from 'src/core/interfaces/dashboard-stats.interface';
import { Customer, Order, Product } from 'src/entities';
import { OrderStatus } from 'src/modules/order/enums/order-setatus.enum';
import { formatCurrency } from 'src/utils/helper.util';
import { Repository, DataSource } from 'typeorm';
import { IDashboardStatsReport } from '../interfaces';

export class ReportService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Order) private orderRespository: Repository<Order>,
    private dataSource: DataSource,
  ) {}

  async getDashboardStats(): Promise<IDashboardStats> {
    const [
      totalCustomers,
      totalProducts,
      totalOrders,
      ordersByStatuses,
      repeatCustomerPercentage,
      revenueAndProfitResult,
    ] = await Promise.all([
      this.customerRepository.createQueryBuilder().getCount(),
      this.productRepository.createQueryBuilder().getCount(),
      this.orderRespository.createQueryBuilder().getCount(),
      this.getOrdersByStatuses(),
      this.getRepeatCustomerPercentage(),
      this.getRevenueAndProfit(),
    ]);

    const stats: IDashboardStats = {
      totalCustomers,
      totalProducts,
      totalOrders,
      totalPendingOrders: Number(ordersByStatuses?.pending),
      totalDispatchedOrders: Number(ordersByStatuses?.dispatched),
      totalDeliveredOrders: Number(ordersByStatuses?.delivered),
      totalReturnedOrders: Number(ordersByStatuses?.returned),
      totalVendorOrders: Number(ordersByStatuses?.vendor),
      repeatedCustomerPercentage: `${repeatCustomerPercentage.toFixed(2)}%`,
      totalRevenue: formatCurrency(
        Number(revenueAndProfitResult?.totalRevenue),
      ),
      totalProfit: formatCurrency(Number(revenueAndProfitResult?.totalProfit)),
    };

    return stats;
  }

  private async getRepeatCustomerPercentage(): Promise<number> {
    const repeatCustomerPercentageResult = await this.orderRespository
      .createQueryBuilder('order')
      .select(
        `
      CASE
        WHEN COUNT(DISTINCT "order"."customerId") = 0 THEN 0
        ELSE (COUNT(DISTINCT CASE WHEN orderCount > 1 THEN "order"."customerId" END)::float / COUNT(DISTINCT "order"."customerId")::float) * 100
      END AS "repeatCustomerPercentage"
    `,
      )
      .innerJoin(
        (qb) =>
          qb
            .from(Order, 'subOrder')
            .select('COUNT(subOrder.id) as orderCount')
            .addSelect('subOrder.customerId')
            .groupBy('subOrder.customerId'),
        'groupedOrders',
        '"groupedOrders"."customerId" = "order"."customerId"',
      )
      .getRawOne();

    return (
      parseFloat(repeatCustomerPercentageResult.repeatCustomerPercentage) || 0
    );
  }

  private async getOrdersByStatuses(): Promise<IDashboardStatsReport> {
    const financialStatus = await this.dataSource
      .createQueryBuilder()
      .addSelect(
        'SUM(CASE WHEN order.status = :delivered THEN 1 ELSE 0 END)',
        'delivered',
      )
      .addSelect(
        'SUM(CASE WHEN order.status = :pending THEN 1 ELSE 0 END)',
        'pending',
      )
      .addSelect(
        'SUM(CASE WHEN order.status = :dispatched THEN 1 ELSE 0 END)',
        'dispatched',
      )
      .addSelect(
        'SUM(CASE WHEN order.status = :vendor THEN 1 ELSE 0 END)',
        'vendor',
      )
      .addSelect(
        'SUM(CASE WHEN order.status = :returned THEN 1 ELSE 0 END)',
        'returned',
      )
      .from(Order, 'order')
      .setParameters({
        delivered: OrderStatus.DELIVERED,
        pending: OrderStatus.PENDING,
        dispatched: OrderStatus.DISPATCHED,
        vendor: OrderStatus.VENDOR,
        returned: OrderStatus.RETURNED,
      })
      .getRawOne();

    return financialStatus;
  }

  async getRevenueAndProfit(): Promise<{
    totalRevenue: number;
    totalProfit: number;
  }> {
    const totalRevenueQuery = this.orderRespository
      .createQueryBuilder('order')
      .select(
        'SUM(CASE WHEN order.status = :delivered THEN order.amount ELSE 0 END)',
        'totalRevenue',
      )
      .setParameter('delivered', OrderStatus.DELIVERED);

    const totalProfitQuery = this.orderRespository
      .createQueryBuilder('order')
      .select(
        'SUM(CASE WHEN order.status = :delivered THEN (orderItem.price - product.cost) * orderItem.quantity ELSE 0 END)',
        'totalProfit',
      )
      .leftJoin('order.orderItems', 'orderItem')
      .leftJoin('orderItem.product', 'product')
      .setParameter('delivered', OrderStatus.DELIVERED);

    const [totalRevenue, totalProfit] = await Promise.all([
      totalRevenueQuery.getRawOne(),
      totalProfitQuery.getRawOne(),
    ]);

    return {
      totalRevenue: parseFloat(totalRevenue.totalRevenue),
      totalProfit: parseFloat(totalProfit.totalProfit),
    };
  }
}
