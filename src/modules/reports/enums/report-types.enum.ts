export const ORDER_REPORT_TYPES = {
  ORDERS_PERCENTAGE_BY_PROVINCE: 'orders_percentage_by_province',
  MONTHLY_ORDERS: 'monthly_orders',
  YEARLY_ORDERS: 'yearly_orders',
  ORDER_SUMMARY: 'order_summary',
  ORDERS_PERCENTAGE_BY_SOURCE: 'orders_percentage_by_source',
} as const;

export type OrderReportType =
  (typeof ORDER_REPORT_TYPES)[keyof typeof ORDER_REPORT_TYPES];

export const PRODUCT_REPORT_TYPES = {
  TOP_PERFORMING_PRODUCTS: 'top_performing_products',
} as const;

export type ProductReportType =
  (typeof PRODUCT_REPORT_TYPES)[keyof typeof PRODUCT_REPORT_TYPES];
