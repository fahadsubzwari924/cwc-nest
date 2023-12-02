import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderProduct } from './order-product.entity';

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

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orders: OrderProduct[];

  @Column()
  weight: string;

  @Column({
    nullable: true,
  })
  thumbnailImage: string;

  @CreateDateColumn()
  createdAt: Date;
}
