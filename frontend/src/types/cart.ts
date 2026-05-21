import type { Product } from '@/types/product';

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  size: string;
  color: string;
  lineTotal: number;
}

export interface CartResponse {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface AddCartItemPayload {
  productId: number;
  quantity: number;
  size: string;
  color: string;
}

export interface UpdateCartItemPayload {
  quantity: number;
}
