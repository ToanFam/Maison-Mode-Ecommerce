import { api } from '@/services/api';
import type { ApiResponse } from '@/types/api';
import type { CheckoutPayload, CreateOrderPayload, Order } from '@/types/order';

export const orderService = {
  async create(payload: CreateOrderPayload) {
    const { data } = await api.post<ApiResponse<Order>>('/orders', payload);
    return data.data;
  },
  async mine() {
    const { data } = await api.get<ApiResponse<Order[]>>('/orders/me');
    return data.data;
  },
  async checkout(payload: CheckoutPayload) {
    const { data } = await api.post<ApiResponse<Order>>('/orders/checkout', payload);
    return data.data;
  },
};
