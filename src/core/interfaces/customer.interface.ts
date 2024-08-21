import { IOrder } from './order.interface';

export interface ICustomer {
  id?: number;
  fullName: string;
  age: number;
  country: string;
  city: string;
  province: string;
  address: string;
  contactNumber: string;
  orders?: Array<IOrder>;
  createdAt?: Date;
  updatedAt?: Date;
}
