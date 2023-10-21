import { IProduct } from 'src/modules/product/interfaces/product';
import { ICustomer } from './customer.interface';

export interface IOrder {
  id?: number;
  description: string;
  quantity?: number;
  amount: number;
  paymentMethod: string;
  customizeName?: string;
  weight?: string;
  customer?: ICustomer;
  products?: Array<IProduct>;
  createdAt?: Date;
  customerId: number;
  productIds: Array<number>;
}
