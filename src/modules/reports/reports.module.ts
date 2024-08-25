import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from './reports.controller';
import { ReportService } from './services/reports.service';
import { Customer, Order, OrderItem, Product } from 'src/entities';
import { OrderReportsModule } from './order-reports/order-reports.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Product, Order, OrderItem]),
    OrderReportsModule,
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
