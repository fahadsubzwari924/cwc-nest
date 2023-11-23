import { OrderProduct } from 'src/entities/order-product.entity';
import { Product } from 'src/entities/product.entity';

export type OrderProductSubset = Pick<
  OrderProduct,
  'customizeName' | 'price' | 'color' | 'createdAt'
> &
  Pick<Product, 'id' | 'name' | 'cost' | 'weight'>;
