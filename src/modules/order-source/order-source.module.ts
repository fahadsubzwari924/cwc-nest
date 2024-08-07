import { Module } from '@nestjs/common';
import { OrderSourceController } from './order-source.controller';
import { OrderSourceService } from './services/order-source.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderSource } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([OrderSource])],
  controllers: [OrderSourceController],
  providers: [OrderSourceService],
})
export class OrderSourceModule {}
