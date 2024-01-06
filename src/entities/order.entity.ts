import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { OrderProduct } from './order-product.entity';
import { OrderStatus } from 'src/modules/order/enums/order-setatus.enum';

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
  customer: Customer;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinTable()
  products: Array<OrderProduct>;

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

  @CreateDateColumn()
  createdAt: Date;
}
