import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Product } from 'src/entities/product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductService } from './services/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts() {
    try {
      const products = await this.productService.getAllProducts();
      return {
        records: products,
        metadata: {
          count: products.length,
        },
      };
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
}
