import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Order } from '../../entities/order.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderService } from './services/order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAllOrders() {
    try {
      const orders = await this.orderService.getAllOrders();
      return {
        records: orders,
        metadata: {
          count: orders.length,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
    const order = await this.orderService.getOrderById(Number(id));
    return order;
  }

  @Post()
  async createOrder(@Body() order: CreateOrderDto) {
    const newOrder = await this.orderService.createOrder(order);
    return newOrder;
  }
}
