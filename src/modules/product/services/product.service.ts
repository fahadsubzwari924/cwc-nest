import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { In, Repository } from 'typeorm';
import { IProduct } from '../interfaces/product';
import { PaginationAndSortingDTO } from '../../../core/pagination/paginationAndSorting.dto';
import { paginateAndSort } from '../../../core/pagination/paginationAndSort.service';
import { IPaginationResponseMeta } from 'src/core/pagination/pagination-response-metadata.interface';

export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAllProducts(
    paginationAndSortingDto: PaginationAndSortingDTO,
  ): Promise<{ records: Array<Product>; metadata: IPaginationResponseMeta }> {
    return paginateAndSort(this.productRepository, paginationAndSortingDto);
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
