import {
  ConflictException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { IOrderSource } from 'src/core/interfaces/order-source.interface';
import { IPaginationResponseMeta } from 'src/core/pagination/pagination-response-metadata.interface';
import { paginateAndSortWithQueryParams } from 'src/core/pagination/paginationAndSort.service';
import { PaginationAndSortingDTO } from 'src/core/pagination/paginationAndSorting.dto';
import { OrderSource } from 'src/entities';
import { Repository, FindOneOptions, DeleteResult, ILike } from 'typeorm';

export class OrderSourceService {
  constructor(
    @InjectRepository(OrderSource)
    private orderSourceRepository: Repository<OrderSource>,
  ) {}

  async getAllOrderSources(
    paginationAndSortingDto: PaginationAndSortingDTO,
  ): Promise<{ data: Array<OrderSource>; metadata: IPaginationResponseMeta }> {
    return paginateAndSortWithQueryParams(
      this.orderSourceRepository,
      paginationAndSortingDto,
    );
  }

  async getOrderSourceById(id: number): Promise<OrderSource> {
    const orderSource = await this.orderSourceRepository.findOne({
      where: {
        id: id,
      },
    });
    if (orderSource) {
      return orderSource;
    }
    throw new NotFoundException('Order source not found');
  }

  async createOrderSource(orderSource: IOrderSource): Promise<OrderSource> {
    const existingOrderSource = await this.orderSourceRepository.findOne({
      where: {
        name: orderSource?.name,
        type: orderSource?.type,
      },
    });

    if (existingOrderSource) {
      throw new ConflictException(
        `Order source with the name ${orderSource?.name} already exists!`,
      );
    }

    const newOrderSource = this.orderSourceRepository.create(orderSource);
    await this.orderSourceRepository.save(newOrderSource);
    return newOrderSource;
  }

  async updateOrderSource(
    id: number,
    orderSource: IOrderSource,
  ): Promise<OrderSource> {
    const findOptions: FindOneOptions<OrderSource> = {
      where: { id },
    };

    const existingOrderSource = await this.orderSourceRepository.findOne(
      findOptions,
    );

    if (!existingOrderSource) {
      throw new NotFoundException('Order source not found');
    }

    const updatedOrderSource = plainToClass(OrderSource, {
      ...existingOrderSource,
      ...orderSource,
    });
    updatedOrderSource.id = id;

    this.orderSourceRepository.merge(existingOrderSource, updatedOrderSource);

    try {
      await this.orderSourceRepository.save(updatedOrderSource);
      return updatedOrderSource;
    } catch (error) {
      throw new HttpException(
        'Update Order Source Failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteOrderSource(id: number): Promise<DeleteResult> {
    const orderSource = await this.orderSourceRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!orderSource) {
      throw new NotFoundException('Order source not found');
    }

    const deletedOrderSource = await this.orderSourceRepository.delete(id);

    return deletedOrderSource;
  }
}
