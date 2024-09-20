import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from './reports.controller';
import { ReportService } from './services/reports.service';
import { Customer, Order, OrderItem, Product } from 'src/entities';
import { OrderReportsService } from './services/order-reports.service';
import { ProductReportsService } from './services/product-reports.service';
import { ReportServiceRegistry } from './services/report-service.registry';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Product, Order, OrderItem])],
  controllers: [ReportController],
  providers: [
    ReportService,
    OrderReportsService,
    ProductReportsService,
    ReportServiceRegistry,
  ],
})
export class ReportModule {}
