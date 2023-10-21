export interface CustomResponse {
  payload: any;
  error?: boolean;
}

export interface CustomErrorResponse {
  statusCode: number;
  error?: boolean;
  message: string;
}
