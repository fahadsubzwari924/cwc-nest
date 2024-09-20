import { IOrdersByMonthReport } from './ordersByMonthReport.interface';

export interface IOrderSummaryReport {
  year: number;
  orderCount: number;
  orderByMonths: Array<IOrdersByMonthReport>;
}
