import { Entity, PrimaryColumn, Column, ManyToOne, Table } from 'typeorm';
import { Order } from './order.entity';
import { OrderSource } from './order-source.entity';

@Entity('order_to_sources')
export class OrderToSource {
  @PrimaryColumn()
  orderId: number;

  @PrimaryColumn()
  orderSourceId: number;

  @ManyToOne(() => Order, (order) => order.orderSources)
  order: Order;

  @ManyToOne(() => OrderSource, (orderSource) => orderSource.orders)
  orderSource: OrderSource;
}
