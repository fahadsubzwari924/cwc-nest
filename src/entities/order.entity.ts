import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
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

  @ManyToOne(() => OrderSource, (orderSource) => orderSource.orders)
  @JoinColumn({ name: 'orderSourceId' })
  @Index()
  orderSource: Customer;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @Column({
    nullable: true,
  })
  totalWeight: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    nullable: false,
    default: new Date(),
  })
  orderDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
