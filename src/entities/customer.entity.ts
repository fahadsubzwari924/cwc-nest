import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('customers')
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    length: 100,
  })
  fullName: string;

  @Column()
  age: number;

  @Column()
  country: string;

  @Column({
    nullable: false,
  })
  city: string;

  @Column({
    nullable: false,
  })
  address: string;

  @Column({
    nullable: false,
  })
  contactNumber: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
