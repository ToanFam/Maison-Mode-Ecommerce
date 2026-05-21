import { api } from '@/services/api';
import type { ApiResponse, PageResponse } from '@/types/api';
import type { Category, Product } from '@/types/product';

interface ProductFilters {
  search?: string;
  category?: string;
  featured?: boolean;
  page?: number;
  size?: number;
}

export const productService = {
  async list(filters: ProductFilters = {}) {
    const { data } = await api.get<ApiResponse<PageResponse<Product>>>('/products', {
      params: filters,
    });
    return data.data;
  },
  async getById(id: number) {
    const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return data.data;
  },
  async getBySlug(slug: string) {
    const { data } = await api.get<ApiResponse<Product>>(`/products/slug/${slug}`);
    return data.data;
  },
  async categories() {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories');
    return data.data;
  },
};
