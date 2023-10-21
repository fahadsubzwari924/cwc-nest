import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({
    nullable: true,
  })
  price: number;

  @Column()
  weight: string;

  @CreateDateColumn()
  createdAt: Date;
}
