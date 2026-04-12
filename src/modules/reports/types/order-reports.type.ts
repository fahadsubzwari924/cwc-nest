import {
  IOrderSummaryReport,
  IOrdersByMonthReport,
  IOrdersByYearReport,
  IOrdersPercentageByProvinceReport,
  IMonthlyProfitReport,
  IYearlyProfitReport,
} from '../interfaces';
import { IOrderPercentageBySourceReport } from '../interfaces/orders/ordersBySourceReport.interface';

export type OrderReportResult =
  | Array<IOrdersPercentageByProvinceReport>
  | Array<IOrdersByMonthReport>
  | Array<IOrdersByYearReport>
  | Array<IOrderSummaryReport>
  | Array<IOrderPercentageBySourceReport>
  | Array<IMonthlyProfitReport>
  | Array<IYearlyProfitReport>;
