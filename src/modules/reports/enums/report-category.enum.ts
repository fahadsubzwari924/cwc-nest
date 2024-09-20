export const REPORT_CATEGORIES = {
  ORDERS: 'orders',
  PRODUCTS: 'products',
  CUSTOMERS: 'customers',
  SALES_AND_REVENUE: 'sales_and_revenue',
} as const;

export type ReportCategory =
  (typeof REPORT_CATEGORIES)[keyof typeof REPORT_CATEGORIES];
