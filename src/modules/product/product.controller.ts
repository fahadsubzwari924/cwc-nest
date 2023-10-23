import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { Product } from 'src/entities/product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductService } from './services/product.service';
import { PaginationAndSortingDTO } from '../../core/pagination/paginationAndSorting.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { DeleteResult } from 'typeorm';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(@Query() query: PaginationAndSortingDTO) {
    try {
      return await this.productService.getAllProducts(query);
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    const product = await this.productService.getProductById(Number(id));
    return product;
  }

  @Post()
  async createProduct(@Body() product: CreateProductDto) {
    const newProduct = await this.productService.createProduct(product);
    return newProduct;
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
  ) {
    const newProduct = await this.productService.updateProduct(
      Number(id),
      product,
    );
    return newProduct;
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new NotFoundException('Product does not exist!');
    }
    return this.productService.deleteProduct(id);
  }
}
