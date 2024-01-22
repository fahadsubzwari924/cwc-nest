import { InjectRepository } from '@nestjs/typeorm';
import { IDashboardStats } from 'src/core/interfaces/dashboard-stats.interface';
import { IOrderBYCity } from 'src/core/interfaces/orders-by-city.interface';
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
      .select('COUNT(*)', 'repeatCustomerCount')
      .from(
        (subquery) =>
          subquery
            .select('customer.id')
            .distinct(true)
            .from(Order, 'o')
            .innerJoin('o.customer', 'customer')
            .groupBy('customer.id')
            .having('COUNT(o.id) > 1'),
        'subquery',
      )
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

  async getOrderByCities(
    startDate: Date,
    endDate: Date,
  ): Promise<IOrderBYCity[]> {
    try {
      const totalCount = await this.orderRespository.count();

      const queryBuilder = this.orderRespository
        .createQueryBuilder('o')
        .innerJoinAndSelect('o.customer', 'cs')
        .select(['COUNT(o.id), cs.city'])
        .where(`o.orderDate BETWEEN '${startDate}' AND '${endDate}'`)
        .groupBy('cs.city');
      const results = await queryBuilder.getRawMany();

      if (!results?.length) {
        return [];
      }

      const cityPercentages: IOrderBYCity[] = results.map((x) => {
        return {
          percentage: `${(((x?.count ?? 0) / (totalCount ?? 0)) * 100).toFixed(
            2,
          )}%`,
          city: x.city,
        };
      });
      return cityPercentages;
    } catch (error) {
      throw error;
    }
  }
}
