import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ICustomResponse } from 'src/core/interfaces/controller-response.interface';
import { PaginationAndSortingDTO } from 'src/core/pagination/paginationAndSorting.dto';
import { Order } from '../../entities/order.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderService } from './services/order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAllOrders(@Query() query: PaginationAndSortingDTO) {
    try {
      return await this.orderService.getAllOrders(query);
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<ICustomResponse> {
    const order = await this.orderService.getOrderById(Number(id));
    return { data: order, metadata: { orderId: Number(id) } };
  }

  @Post()
  async createOrder(@Body() order: CreateOrderDto): Promise<ICustomResponse> {
    const newOrder = await this.orderService.createOrder(order);
    return { data: newOrder };
  }
}
