export interface CreateOrderItem {
  productId: number;
  quantity: number;
  size: string;
  color: string;
}

export interface CreateOrderPayload {
  items: CreateOrderItem[];
}

export interface CheckoutPayload {
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  size: string;
  color: string;
  unitPrice: number;
}

export interface Order {
  id: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}
