import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity('order-items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  customizeName: string;

  @Column({
    nullable: false,
  })
  price: number;

  @Index()
  @ManyToOne(() => Product, (product) => product.orderItems)
  product: Product;

  @Index()
  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({
    nullable: true,
  })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
