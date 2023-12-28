import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ICustomResponse } from 'src/core/interfaces/controller-response.interface';
import { PaginationAndSortingDTO } from 'src/core/pagination/paginationAndSorting.dto';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderService } from './services/order.service';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Public } from 'src/utils/decorators/no-intercept.decorator';
import { Response } from 'express';

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

  @Get(':id/pdf')
  @Public()
  async getOrderReceipt(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    const orderReceiptBuffer = await this.orderService.generateOrderReceipt(
      Number(id),
    );
    res.set('Content-Type', 'application/pdf');
    res.set(
      'Content-Disposition',
      `attachment; filename="order-receipt-${id}.pdf"`,
    );
    res.send(orderReceiptBuffer);
  }

  @Post()
  async createOrder(@Body() order: CreateOrderDto): Promise<ICustomResponse> {
    const newOrder = await this.orderService.createOrder(order);
    return { data: newOrder };
  }

  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() order: UpdateOrderDto,
  ): Promise<ICustomResponse> {
    const updatedOrder = await this.orderService.updateOrder(Number(id), order);
    return { data: updatedOrder, metadata: { orderId: Number(id) } };
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<ICustomResponse> {
    try {
      const deleteOrder = await this.orderService.deleteOrder(Number(id));
      return { data: !!deleteOrder, metadata: { orderId: Number(id) } };
    } catch (error) {
      console.log(error);
    }
  }
}
