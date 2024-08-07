import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { OrderSourceType } from 'src/modules/order/enums/order-source-type.enum';

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

  @OneToMany(() => Order, (order) => order.orderSource)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
