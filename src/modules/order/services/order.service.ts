import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrder } from 'src/core/interfaces/order.interface';
import { IPaginationResponseMeta } from 'src/core/pagination/pagination-response-metadata.interface';
import { paginateAndSort } from 'src/core/pagination/paginationAndSort.service';
import { PaginationAndSortingDTO } from 'src/core/pagination/paginationAndSorting.dto';
import { Customer } from 'src/entities/customer.entity';
import { Order } from 'src/entities/order.entity';
import { ProductService } from 'src/modules/product/services/product.service';
import { Repository } from 'typeorm';
import { CreateOrderDto, OrderProductDto } from '../dtos/create-order.dto';
import { OrderProduct } from 'src/entities/order-product.entity';
import { Product } from 'src/entities/product.entity';
import { OrderProductSubset } from '../types/product.type';

export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private productService: ProductService,
  ) {}

  async getAllOrders(
    paginationAndSortingDto: PaginationAndSortingDTO,
  ): Promise<{ data: Array<Order>; metadata: IPaginationResponseMeta }> {
    const relations = { customer: true, products: true };
    const orders: any = await paginateAndSort(
      this.orderRepository,
      paginationAndSortingDto,
      relations,
    );

    const transformedOrder = orders.data.map((order: Order) => {
      return {
        ...order,
        products: this.formatOrderProducts(order),
      };
    });
    return { data: transformedOrder, metadata: orders.metadata };
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id: id,
      },
      relations: { customer: true, products: true },
    });
    if (order) {
      return order;
    }
    throw new NotFoundException('Could not find the order');
  }

  async createOrder(orderData: CreateOrderDto) {
    const order = new Order();

    /* populating order fields */
    order.description = orderData.description;
    order.amount = orderData.amount;
    order.quantity = orderData.totalProductQuantity;
    order.paymentMethod = orderData.paymentMethod;
    order.totalWeight = orderData.totalWeight;
    order.products = [];
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

    for (const orderItemData of orderData.products) {
      const orderProduct = new OrderProduct();
      orderProduct.customizeName = orderItemData.customizeName;
      orderProduct.price = orderItemData.price;
      orderProduct.color = orderItemData.color;

      const product = await this.productService.getProductById(
        Number(orderItemData.id),
      );
      if (!product) {
        throw new NotFoundException(`Product not found: ${orderItemData.id}`);
      }
      orderProduct.product = product;
      order.products.push(orderProduct);
    }

    if (!order.products?.length) {
      throw new NotFoundException('Products not found');
    }

    const newOrder = await this.orderRepository.save(order);
    return newOrder;
  }

  formatOrderProducts(order: Order): Array<OrderProductSubset> {
    return order.products.map((orderProduct: OrderProduct & Product) => ({
      id: orderProduct?.product?.id,
      name: orderProduct?.product?.name,
      cost: orderProduct?.product?.cost,
      price: orderProduct.price,
      weight: orderProduct?.product?.weight,
      customizeName: orderProduct.customizeName,
      color: orderProduct.color,
      createdAt: orderProduct.createdAt,
    }));
  }
}
