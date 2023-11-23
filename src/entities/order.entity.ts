import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Customer } from './customer.entity';
import { OrderProduct } from './order-product.entity';

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
  customer: Customer;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    cascade: true,
  })
  @JoinTable()
  products: Array<OrderProduct>;

  @Column({
    nullable: true,
  })
  totalWeight: string;

  @CreateDateColumn()
  createdAt: Date;
}
