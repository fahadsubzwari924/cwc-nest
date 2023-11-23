import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('order-products')
export class OrderProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.products)
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Product, (product) => product.orders, { eager: true })
  @JoinColumn()
  product: Product;

  @Column({
    nullable: false,
  })
  price: number;

  @Column({ nullable: true })
  customizeName: string;

  @Column({ nullable: true })
  color: string;

  @CreateDateColumn()
  createdAt: Date;
}
