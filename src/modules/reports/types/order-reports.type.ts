import {
  IOrderSummaryReport,
  IOrdersByMonthReport,
  IOrdersByYearReport,
  IOrdersPercentageByProvinceReport,
} from '../interfaces';

export type OrderReportResult =
  | Array<IOrdersPercentageByProvinceReport>
  | Array<IOrdersByMonthReport>
  | Array<IOrdersByYearReport>
  | Array<IOrderSummaryReport>;
