import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderSourceType } from 'src/modules/order/enums/order-source-type.enum';
import { Order } from './order.entity';

@Entity('order-sources')
export class OrderSource extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('orderSourceIdx')
  @Column({
    nullable: true,
    length: 200,
  })
  name: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: OrderSourceType,
  })
  type: OrderSourceType;

  @Column()
  description: string;

  @ManyToMany(() => Order, (order) => order.orderSources)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
