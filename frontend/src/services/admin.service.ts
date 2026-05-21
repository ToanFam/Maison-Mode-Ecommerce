import { api } from '@/services/api';
import type { ApiResponse, PageResponse } from '@/types/api';
import type { AdminStats, CategoryOption, ProductPayload } from '@/types/admin';
import type { Order } from '@/types/order';
import type { Product } from '@/types/product';

export const adminService = {
  async stats() {
    const { data } = await api.get<ApiResponse<AdminStats>>('/admin/stats');
    return data.data;
  },
  async categories() {
    const { data } = await api.get<ApiResponse<CategoryOption[]>>('/admin/categories');
    return data.data;
  },
  async products(search: string, page: number) {
    const { data } = await api.get<ApiResponse<PageResponse<Product>>>('/admin/products', {
      params: { search, page, size: 8, sort: 'createdAt,desc' },
    });
    return data.data;
  },
  async createProduct(payload: ProductPayload) {
    const { data } = await api.post<ApiResponse<Product>>('/admin/products', payload);
    return data.data;
  },
  async updateProduct(productId: number, payload: ProductPayload) {
    const { data } = await api.put<ApiResponse<Product>>(`/admin/products/${productId}`, payload);
    return data.data;
  },
  async deleteProduct(productId: number) {
    await api.delete(`/admin/products/${productId}`);
  },
  async uploadProductImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<ApiResponse<{ url: string }>>(
      '/admin/uploads/product-image',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return data.data;
  },
  async orders(page: number) {
    const { data } = await api.get<ApiResponse<PageResponse<Order>>>('/admin/orders', {
      params: { page, size: 8, sort: 'createdAt,desc' },
    });
    return data.data;
  },
  async updateOrderStatus(orderId: number, status: Order['status']) {
    const { data } = await api.patch<ApiResponse<Order>>(`/admin/orders/${orderId}/status`, {
      status,
    });
    return data.data;
  },
};
