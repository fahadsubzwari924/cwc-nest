import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Customer } from './customer.entity';

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

  @Column()
  weight: string;

  @Column()
  customizeName: string;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;
}
