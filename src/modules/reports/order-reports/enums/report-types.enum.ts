export const REPORT_TYPES = {
  ORDERS_PERCENTAGE_BY_PROVINCE: 'orders_percentage_by_province',
  MONTHLY_ORDERS: 'monthly_orders',
  YEARLY_ORDERS: 'yearly_orders',
  ORDER_SUMMARY: 'order_summary',
} as const;

export type ReportType = (typeof REPORT_TYPES)[keyof typeof REPORT_TYPES];
