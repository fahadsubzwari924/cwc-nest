import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  User,
  Product,
  Customer,
  Order,
  OrderItem,
  OrderSource,
} from '../entities';
import { OrderToSource } from 'src/entities/order-to-source.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PG_HOST'),
        port: configService.get('PG_PORT'),
        username: configService.get('PG_USERNAME'),
        password: configService.get('PG_PASSWORD'),
        database: configService.get('PG_DATABASE'),
        entities: [
          Product,
          Customer,
          Order,
          User,
          OrderItem,
          OrderSource,
          OrderToSource,
        ],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
        extra: {
          sslmode: 'require',
        },
        schema: 'public',
      }),
    }),
  ],
})
export class DashboardModule {}
