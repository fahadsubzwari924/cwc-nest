import { OrderProduct } from 'src/entities/order-product.entity';
import { Product } from 'src/entities/product.entity';

/* Picking some fields from both Product & OrderProduct to create new type */
export type OrderProductSubset = Pick<
  OrderProduct,
  'customizeName' | 'price' | 'color' | 'createdAt'
> &
  Pick<Product, 'id' | 'name' | 'cost' | 'weight'>;
