import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { In, Repository } from 'typeorm';
import { IProduct } from '../interfaces/product';

export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAllProducts(): Promise<Array<Product>> {
    const products = this.productRepository.find({ order: { createdAt: -1 } });
    return products;
  }

  async getAllProductsByIds(
    productIds: Array<number>,
  ): Promise<Array<Product>> {
    const products = await this.productRepository.findBy({
      id: In(productIds),
    });
    return products;
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
    });
    if (product) {
      return product;
    }
    throw new NotFoundException('Could not find the message');
  }

  async createProduct(product: IProduct) {
    const newProduct = this.productRepository.create(product);
    await this.productRepository.save(newProduct);
    return newProduct;
  }
}
