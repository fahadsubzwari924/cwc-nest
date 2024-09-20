// src/reports/services/report-service.registry.ts

import { Injectable } from '@nestjs/common';
import { OrderReportsService } from './order-reports.service';
import { IReportService } from '../interfaces/report-service.interface';
import { ProductReportsService } from './product-reports.service';

@Injectable()
export class ReportServiceRegistry {
  private readonly registry: Map<string, IReportService> = new Map();

  constructor(
    private readonly orderReportsService: OrderReportsService,
    private readonly productReportsService: ProductReportsService,
  ) {
    this.registry.set('orders', this.orderReportsService);
    this.registry.set('products', this.productReportsService);
  }

  getService(category: string): IReportService {
    const service = this.registry.get(category);
    if (!service) {
      throw new Error(`No report service found for category: ${category}`);
    }
    return service;
  }
}
