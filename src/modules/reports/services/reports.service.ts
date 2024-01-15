import { InjectRepository } from '@nestjs/typeorm';
import { IDashboardStats } from 'src/core/interfaces/dashboard-stats.interface';
import { Customer, Order, Product } from 'src/entities';
import { OrderStatus } from 'src/modules/order/enums/order-setatus.enum';
import { Repository, DataSource } from 'typeorm';

export class ReportService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Order) private orderRespository: Repository<Order>,
    private dataSource: DataSource,
  ) {}

  async getDashboardStats(): Promise<IDashboardStats> {
    // total customer, products, orders
    // pending, dispatched, delivered orders
    const totalCustomers = await this.customerRepository
      .createQueryBuilder()
      .getCount();

    const totalProducts = await this.productRepository
      .createQueryBuilder()
      .getCount();

    const totalOrders = await this.orderRespository
      .createQueryBuilder()
      .getCount();

    const totalPendingOrders = await this.orderRespository
      .createQueryBuilder('order')
      .where('order.status = :status', { status: OrderStatus.PENDING })
      .getCount();

    const totalDispatchedOrders = await this.orderRespository
      .createQueryBuilder('order')
      .where('order.status = :status', { status: OrderStatus.DISPATCHED })
      .getCount();

    const totalDeliveredOrders = await this.orderRespository
      .createQueryBuilder('order')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
      .getCount();

    const totalReturnedOrders = await this.orderRespository
      .createQueryBuilder('order')
      .where('order.status = :status', { status: OrderStatus.RETURNED })
      .getCount();

    const queryBuilder = this.dataSource.createQueryBuilder();

    const repeatCustomerCount = await queryBuilder
      .select('COUNT(DISTINCT customer.id)', 'repeatCustomerCount')
      .from(Order, 'o')
      .innerJoin('o.customer', 'customer')
      .groupBy('customer.id')
      .having('COUNT(o.id) > 1')
      .getRawOne();

    const repeatedCustomerPercentage =
      (Number(repeatCustomerCount?.repeatCustomerCount ?? 0) / totalCustomers) *
      100;

    const stats: IDashboardStats = {
      totalCustomers,
      totalProducts,
      totalOrders,
      totalPendingOrders,
      totalDispatchedOrders,
      totalDeliveredOrders,
      totalReturnedOrders,
      repeatedCustomerPercentage: `${repeatedCustomerPercentage.toFixed(2)}%`,
    };

    return stats;
  }
}
