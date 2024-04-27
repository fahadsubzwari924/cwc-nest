import { OrderItem } from 'src/entities';
import { Product } from 'src/entities/product.entity';

/* Picking some fields from both Product & OrderProduct to create new type */
export type OrderProductSubset = Pick<
  OrderItem,
  'customizeName' | 'price' | 'color' | 'createdAt'
> &
  Pick<Product, 'id' | 'name' | 'cost' | 'weight'>;
