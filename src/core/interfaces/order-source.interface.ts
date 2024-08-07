import { OrderSourceType } from 'src/modules/order/enums/order-source-type.enum';

export interface IOrderSource {
  id?: number;
  name: string;
  type: OrderSourceType;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
