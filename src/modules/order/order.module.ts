import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/entities/customer.entity';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { ProductService } from '../product/services/product.service';
import { OrderController } from './order.controller';
import { OrderService } from './services/order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Customer, Product])],
  controllers: [OrderController],
  providers: [OrderService, ProductService],
})
export class OrderModule {}
