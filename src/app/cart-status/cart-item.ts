import { Product } from '../product-list/product.model';

export interface CartItem {
  id: number;
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
}

export function createCartItem(product: Product): CartItem {
  return {
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    unitPrice: product.unitPrice,
    quantity: 1,
  };
}
