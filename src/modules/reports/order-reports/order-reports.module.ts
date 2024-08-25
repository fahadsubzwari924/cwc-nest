import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities';
import { OrderReportsController } from './order-reports.controller';
import { OrderReportsService } from './services/order-reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [OrderReportsController],
  providers: [OrderReportsService],
})
export class OrderReportsModule {}
