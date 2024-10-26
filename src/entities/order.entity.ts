import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { OrderStatus } from 'src/modules/order/enums/order-setatus.enum';
import { OrderItem } from './order-item.entity';
import { OrderSource } from './order-source.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @Index()
  id: number;

  @Column({
    length: 500,
  })
  description: string;

  @Column({
    nullable: true,
  })
  quantity: number;

  @Column({
    nullable: false,
  })
  amount: number;

  @Column({
    nullable: false,
  })
  paymentMethod: string;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customerId' })
  @Index()
  customer: Customer;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @ManyToMany(() => OrderSource, (orderSource) => orderSource.orders, {
    cascade: true,
  })
  @JoinTable({
    name: 'order_to_sources',
    joinColumn: { name: 'orderId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'orderSourceId', referencedColumnName: 'id' },
  })
  orderSources: OrderSource[];

  @Column({
    nullable: true,
  })
  totalWeight: string;

  @Index()
  @Column({
    nullable: false,
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Index()
  @Column({
    nullable: false,
    default: new Date(),
  })
  orderDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
