export interface ICustomResponse {
  data: any;
  metadata?: any;
}

export interface CustomErrorResponse {
  statusCode: number;
  error?: boolean;
  message: string;
}
