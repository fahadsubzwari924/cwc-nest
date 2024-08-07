import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PaginationAndSortingDTO } from 'src/core/pagination/paginationAndSorting.dto';
import { OrderSourceService } from './services/order-source.service';
import { ICustomResponse } from 'src/core/interfaces/controller-response.interface';
import { CreateOrderSourceDto } from './dtos/create-order-source.dto';
import { UpdateOrderSourceDto } from './dtos/update-order-source.dto';

@Controller('order-sources')
export class OrderSourceController {
  constructor(private readonly orderSourceService: OrderSourceService) {}

  @Get()
  async getAllOrderSources(@Query() query: PaginationAndSortingDTO) {
    try {
      return await this.orderSourceService.getAllOrderSources(query);
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  async getOrderSourceById(@Param('id') id: string): Promise<ICustomResponse> {
    const orderSource = await this.orderSourceService.getOrderSourceById(
      Number(id),
    );
    return { data: orderSource, metadata: { orderSourceId: Number(id) } };
  }

  @Post()
  async createCustomer(
    @Body() orderSource: CreateOrderSourceDto,
  ): Promise<ICustomResponse> {
    const newOrderSource = await this.orderSourceService.createOrderSource(
      orderSource,
    );
    return { data: newOrderSource };
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() orderSource: UpdateOrderSourceDto,
  ): Promise<ICustomResponse> {
    const updatedOrderSource = await this.orderSourceService.updateOrderSource(
      Number(id),
      orderSource,
    );

    return {
      data: updatedOrderSource,
      metadata: { orderSourceId: Number(id) },
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<ICustomResponse> {
    const orderSource = await this.orderSourceService.getOrderSourceById(id);
    if (!orderSource) {
      throw new NotFoundException('Order source does not exist!');
    }
    await this.orderSourceService.deleteOrderSource(id);
    return { data: true, metadata: { orderSourceId: Number(id) } };
  }
}
