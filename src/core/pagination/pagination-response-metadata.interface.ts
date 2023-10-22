export interface IPaginationResponseMeta {
  totalItems: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
