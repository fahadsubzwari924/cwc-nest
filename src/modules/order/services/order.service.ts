import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
import { UpdateOrderDto } from '../dtos/update-order.dto';
import * as PDFDocument from 'pdfkit';

export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
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

  async getOrderById(id: number): Promise<any> {
    const order = await this.orderRepository.findOne({
      where: {
        id: id,
      },
      relations: { customer: true, products: true },
    });
    if (order) {
      const formattedOrder = {
        ...order,
        products: this.formatOrderProducts(order),
      };
      return formattedOrder;
    }
    throw new NotFoundException('Could not find the order');
  }

  async createOrder(orderData: CreateOrderDto) {
    let order = new Order();

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

    // saving products to sync with incoming products
    if (orderData?.products?.length) {
      order = await this.saveProductsInOrder(order, orderData.products);

      if (!order.products?.length) {
        throw new NotFoundException('Products not found');
      }
    }

    const newOrder = await this.orderRepository.save(order);
    return newOrder;
  }

  async generateOrderReceipt(orderId: number): Promise<Buffer> {
    // const order = this.getOrderById(orderId);

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'A4',
        bufferPages: true,
      });

      // customize your PDF document
      doc.text('hello world', 100, 50);
      doc.end();

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });

    return pdfBuffer;
  }

  async updateOrder(
    orderId: number,
    updateOrderPayload: UpdateOrderDto,
  ): Promise<Order> {
    let order = await this.getOrderById(orderId);

    // updating order fields
    order = this.updateOrderRelatedFieldsOnly(order, updateOrderPayload);

    // saving products to sync with incoming products
    if (updateOrderPayload?.products?.length) {
      // removing products
      await this.orderProductRepository.clear();
      order = await this.saveProductsInOrder(
        order,
        updateOrderPayload.products,
      );

      if (!order.products?.length) {
        throw new NotFoundException('Products not found');
      }
    }

    // Save the updated order
    const updatedOrder = await this.orderRepository.save(order);

    return updatedOrder;
  }

  async deleteOrder(orderId: number): Promise<boolean> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['products'],
    });

    if (!order) {
      throw new NotFoundException(`Order not found: ${orderId}`);
    }

    // Remove associated products
    await this.orderProductRepository.remove(order.products);

    // Remove the order itself
    await this.orderRepository.remove(order);

    return true;
  }

  private formatOrderProducts(order: Order): Array<OrderProductSubset> {
    return order.products.map((orderProduct: OrderProduct & Product) => ({
      id: orderProduct?.product?.id,
      name: orderProduct?.product?.name,
      cost: orderProduct?.product?.cost,
      price: orderProduct.price,
      weight: orderProduct?.product?.weight,
      customizeName: orderProduct.customizeName,
      color: orderProduct.color,
      quantity: orderProduct.quantity,
      createdAt: orderProduct.createdAt,
    }));
  }

  private updateOrderRelatedFieldsOnly(
    order: Order,
    updateOrderPayload: UpdateOrderDto,
  ): Order {
    order.description = updateOrderPayload.description || order.description;
    order.amount = updateOrderPayload.amount || order.amount;
    order.quantity = updateOrderPayload.totalProductQuantity || order.quantity;
    order.paymentMethod =
      updateOrderPayload.paymentMethod || order.paymentMethod;
    order.totalWeight = updateOrderPayload.totalWeight || order.totalWeight;
    order.status = updateOrderPayload.status || order.status;

    return order;
  }

  private async saveProductsInOrder(
    order: Order,
    orderProducts: Array<OrderProductDto>,
  ): Promise<Order> {
    order.products = [];
    for (const orderProductData of orderProducts) {
      const orderProduct = new OrderProduct();
      orderProduct.customizeName = orderProductData.customizeName;
      orderProduct.price = orderProductData.price;
      orderProduct.color = orderProductData.color;
      orderProduct.quantity = orderProductData.quantity;

      const product = await this.productService.getProductById(
        Number(orderProductData.id),
      );
      if (!product) {
        throw new NotFoundException(
          `Product not found: ${orderProductData.id}`,
        );
      }
      orderProduct.product = product;
      order.products.push(orderProduct);
    }
    return order;
  }
}
