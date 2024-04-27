import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('productNameIdx')
  @Column({
    unique: true,
    length: 200,
    nullable: false,
  })
  name: string;

  @Column()
  description: string;

  @Column({
    nullable: false,
  })
  cost: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @Column()
  weight: string;

  @Column({
    nullable: true,
  })
  thumbnailImage: string;

  @CreateDateColumn()
  createdAt: Date;
}
