import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './services/product.service';
import { FilesService } from '../file/services/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, FilesService],
})
export class ProductModule {}
