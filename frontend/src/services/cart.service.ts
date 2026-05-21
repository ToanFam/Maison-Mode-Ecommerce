import { api } from '@/services/api';
import type { ApiResponse } from '@/types/api';
import type { AddCartItemPayload, CartResponse, UpdateCartItemPayload } from '@/types/cart';

export const cartService = {
  async getCart() {
    const { data } = await api.get<ApiResponse<CartResponse>>('/cart');
    return data.data;
  },
  async addItem(payload: AddCartItemPayload) {
    const { data } = await api.post<ApiResponse<CartResponse>>('/cart/items', payload);
    return data.data;
  },
  async updateItem(itemId: number, payload: UpdateCartItemPayload) {
    const { data } = await api.patch<ApiResponse<CartResponse>>(`/cart/items/${itemId}`, payload);
    return data.data;
  },
  async removeItem(itemId: number) {
    const { data } = await api.delete<ApiResponse<CartResponse>>(`/cart/items/${itemId}`);
    return data.data;
  },
  async clear() {
    const { data } = await api.delete<ApiResponse<CartResponse>>('/cart');
    return data.data;
  },
};
