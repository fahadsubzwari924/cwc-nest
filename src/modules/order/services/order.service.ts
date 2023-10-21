import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrder } from 'src/core/interfaces/order.interface';
import { Customer } from 'src/entities/customer.entity';
import { Order } from 'src/entities/order.entity';
import { ProductService } from 'src/modules/product/services/product.service';
import { Repository } from 'typeorm';

export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private productService: ProductService,
  ) {}

  async getAllOrders(): Promise<Array<Order>> {
    const orders = this.orderRepository.find({
      relations: { customer: true, products: true },
    });
    return orders;
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id: id,
      },
    });
    if (order) {
      return order;
    }
    throw new NotFoundException('Could not find the order');
  }

  async createOrder(orderData: IOrder) {
    const order = new Order();

    /* populating order fields */
    order.description = orderData.description;
    order.amount = orderData.amount;
    order.quantity = orderData.quantity;
    order.paymentMethod = orderData.paymentMethod;
    order.weight = orderData.weight;
    order.customizeName = orderData.customizeName;

    /* fetching customer */
    const customer = await this.customerRepository.findOne({
      where: { id: orderData.customerId },
      relations: ['orders'],
    });
    if (!customer) {
      throw new NotFoundException(
        `Customer not found: ${orderData.customerId}`,
      );
    }

    order.customer = customer;

    /* fetching products based on product IDs */
    const orderProducts = await this.productService.getAllProductsByIds(
      orderData.productIds,
    );

    if (!orderProducts?.length) {
      throw new NotFoundException('Products not found');
    }
    order.products = orderProducts;

    const newOrder = await this.orderRepository.save(order);
    return newOrder;
  }
}
