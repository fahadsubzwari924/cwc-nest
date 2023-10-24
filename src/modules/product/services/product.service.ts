import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { DeleteResult, FindOneOptions, In, Repository } from 'typeorm';
import { IProduct } from '../interfaces/product';
import { PaginationAndSortingDTO } from '../../../core/pagination/paginationAndSorting.dto';
import { paginateAndSort } from '../../../core/pagination/paginationAndSort.service';
import { IPaginationResponseMeta } from 'src/core/pagination/pagination-response-metadata.interface';
import { plainToClass } from 'class-transformer';

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
    throw new NotFoundException('Product not found');
  }

  async createProduct(product: IProduct): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    await this.productRepository.save(newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: IProduct) {
    const findOptions: FindOneOptions<Product> = {
      where: { id },
    };

    const existingProduct = await this.productRepository.findOne(findOptions);

    if (!existingProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    // Use class-transformer to update the entity dynamically
    const updatedProduct = plainToClass(Product, {
      ...existingProduct,
      ...product,
    });
    updatedProduct.id = id; // Ensure the ID is set to avoid creating a new record

    this.productRepository.merge(existingProduct, updatedProduct);

    try {
      await this.productRepository.save(updatedProduct);
      return updatedProduct;
    } catch (error) {
      // Handle any errors that may occur during the save operation
      throw new HttpException(
        'Update failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProduct(id: number): Promise<DeleteResult> {
    const deletedProduct = await this.productRepository.delete(id);
    if (!deletedProduct.affected) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return deletedProduct;
  }
}
