import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from './reports.controller';
import { ReportService } from './services/reports.service';
import { Customer, Order, Product } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Product, Order])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
