import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationResponseMeta } from 'src/core/pagination/pagination-response-metadata.interface';
import { paginateAndSort } from 'src/core/pagination/paginationAndSort.service';
import { PaginationAndSortingDTO } from 'src/core/pagination/paginationAndSorting.dto';
import { Customer } from 'src/entities/customer.entity';
import { Order } from 'src/entities/order.entity';
import { ProductService } from 'src/modules/product/services/product.service';
import { In, Repository } from 'typeorm';
import { CreateOrderDto, OrderItemDto } from '../dtos/create-order.dto';
import { Product } from 'src/entities/product.entity';
import { OrderProductSubset } from '../types/product.type';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import * as PDFDocument from 'pdfkit';
import { OrderItem, OrderSource } from 'src/entities';
import { OrderToSource } from 'src/entities/order-to-source.entity';

export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private productService: ProductService,
    @InjectRepository(OrderSource)
    private readonly orderSourceRepository: Repository<OrderSource>,
    @InjectRepository(OrderToSource)
    private readonly orderToSourceRepository: Repository<OrderToSource>,
  ) {}

  async getAllOrders(
    paginationAndSortingDto: PaginationAndSortingDTO,
  ): Promise<{ data: Array<Order>; metadata: IPaginationResponseMeta }> {
    const relations = ['customer', 'orderSources'];
    const orders: any = await paginateAndSort(
      this.orderRepository,
      paginationAndSortingDto,
      relations,
    );

    return { data: orders.data, metadata: orders.metadata };
  }

  async getOrderById(id: number): Promise<any> {
    const order = await this.orderRepository.findOne({
      where: {
        id: id,
      },
      relations: [
        'customer',
        'orderItems',
        'orderItems.product',
        'orderSources',
      ],
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
    const orderToSave = new Order();

    /* populating order fields */
    orderToSave.description = orderData.description;
    orderToSave.amount = this.computeAmountFromItemDtos(orderData.orderItems);
    orderToSave.quantity = this.computeTotalUnitsFromItemDtos(
      orderData.orderItems,
    );
    orderToSave.paymentMethod = orderData.paymentMethod;
    orderToSave.totalWeight = orderData.totalWeight;
    orderToSave.orderDate = orderData.orderDate;
    orderToSave.orderItems = [];
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

    orderToSave.customer = customer;

    if (orderData?.orderSourceIds?.length) {
      const orderSources = await this.orderSourceRepository.findBy({
        id: In(orderData?.orderSourceIds),
      });

      if (!orderSources.length) {
        throw new NotFoundException(
          `Given order sources not found with ids: ${orderData.orderSourceIds}`,
        );
      }
      orderToSave.orderSources = orderSources;
    }

    const newOrder = await this.orderRepository.save(orderToSave);

    // saving products to sync with incoming products
    if (orderData?.orderItems?.length) {
      await this.saveProductsInOrder(newOrder, orderData.orderItems);
      await this.syncOrderHeaderTotals(newOrder.id);
    }

    const createdOrder = await this.getOrderById(newOrder.id);
    return createdOrder;
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
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: [
        'customer',
        'orderItems',
        'orderItems.product',
        'orderSources',
      ],
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    // Update order fields (amount / quantity come from line items after sync)

    order.description = updateOrderPayload.description || order.description;
    order.paymentMethod =
      updateOrderPayload.paymentMethod || order.paymentMethod;
    order.totalWeight = updateOrderPayload.totalWeight || order.totalWeight;
    order.status = updateOrderPayload.status || order.status;
    order.orderDate = updateOrderPayload.orderDate || order.orderDate;

    if (updateOrderPayload.customerId != null) {
      const currentCustomerId = order.customer?.id;
      if (updateOrderPayload.customerId !== currentCustomerId) {
        const customer = await this.customerRepository.findOne({
          where: { id: updateOrderPayload.customerId },
        });
        if (!customer) {
          throw new NotFoundException(
            `Customer not found: ${updateOrderPayload.customerId}`,
          );
        }
        order.customer = customer;
      }
    }

    const newOrderSourceIds = updateOrderPayload.orderSourceIds || [];

    if (newOrderSourceIds?.length) {
      await this.orderSourceRepository
        .createQueryBuilder()
        .delete()
        .from(OrderToSource)
        .where('orderId = :orderId', { orderId })
        .execute();

      const newOrderSources = await this.orderSourceRepository.findBy({
        id: In(newOrderSourceIds),
      });

      if (!newOrderSources.length) {
        throw new NotFoundException(
          `Given order sources not found with ids: ${updateOrderPayload.orderSourceIds}`,
        );
      }
      order.orderSources = newOrderSources;
    }

    const orderAfterUpdate = await this.orderRepository.save(order);

    // Update order products
    if (updateOrderPayload.orderItems?.length) {
      await this.orderItemRepository.remove(order.orderItems);

      await this.saveProductsInOrder(
        orderAfterUpdate,
        updateOrderPayload.orderItems,
      );
    }

    await this.syncOrderHeaderTotals(orderId);

    const updatedOrder = await this.getOrderById(order.id);
    return updatedOrder;
  }

  async deleteOrder(orderId: number): Promise<boolean> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems'],
    });

    if (!order) {
      throw new NotFoundException(`Order not found: ${orderId}`);
    }

    // Remove associated products
    await this.orderItemRepository.remove(order.orderItems);

    await this.orderToSourceRepository.delete({ order: { id: orderId } });

    // Remove the order itself
    await this.orderRepository.remove(order);

    return true;
  }

  private formatOrderProducts(order: Order): Array<OrderProductSubset> {
    return order.orderItems.map((orderItem: OrderItem & Product) => ({
      id: orderItem?.product?.id,
      name: orderItem?.product?.name,
      cost: orderItem?.product?.cost,
      unitCostSnapshot: orderItem.unitCostSnapshot,
      price: orderItem.price,
      weight: orderItem?.product?.weight,
      customizeName: orderItem.customizeName,
      color: orderItem.color,
      quantity: orderItem.quantity,
      createdAt: orderItem.createdAt,
    }));
  }

  private async saveProductsInOrder(
    order: Order,
    orderItems: Array<OrderItemDto>,
  ): Promise<void> {
    const orderItemsToSave: OrderItem[] = [];
    for (const orderItem of orderItems) {
      const newOrderItem = new OrderItem();
      newOrderItem.order = order;
      newOrderItem.customizeName = orderItem.customizeName;
      newOrderItem.price = orderItem.price;
      newOrderItem.color = orderItem.color;
      newOrderItem.quantity = this.normalizeLineQuantity(orderItem.quantity);

      const product = await this.productService.getProductById(
        Number(orderItem.productId),
      );
      if (!product) {
        throw new NotFoundException(
          `Product not found: ${orderItem.productId}`,
        );
      }
      newOrderItem.product = product;
      newOrderItem.unitCostSnapshot = product.cost;
      orderItemsToSave.push(newOrderItem);
    }
    await this.orderItemRepository.save(orderItemsToSave);
  }

  private normalizeLineQuantity(quantity: number): number {
    const n = Math.floor(Number(quantity));
    return n >= 1 ? n : 1;
  }

  private lineRevenue(price: number, quantity: number): number {
    return Number(price) * this.normalizeLineQuantity(quantity);
  }

  private computeAmountFromItemDtos(items: OrderItemDto[]): number {
    return items.reduce(
      (sum, item) => sum + this.lineRevenue(item.price, item.quantity),
      0,
    );
  }

  private computeTotalUnitsFromItemDtos(items: OrderItemDto[]): number {
    return items.reduce(
      (sum, item) => sum + this.normalizeLineQuantity(item.quantity),
      0,
    );
  }

  private async syncOrderHeaderTotals(orderId: number): Promise<void> {
    const items = await this.orderItemRepository.find({
      where: { order: { id: orderId } },
    });
    const amount = items.reduce(
      (sum, item) => sum + this.lineRevenue(item.price, item.quantity),
      0,
    );
    const quantity = items.reduce(
      (sum, item) => sum + this.normalizeLineQuantity(item.quantity),
      0,
    );
    await this.orderRepository.update({ id: orderId }, { amount, quantity });
  }
}
