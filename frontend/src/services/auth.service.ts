import { api } from '@/services/api';
import type { ApiResponse } from '@/types/api';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types/auth';

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload);
    return data.data;
  },
  async register(payload: RegisterPayload) {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    return data.data;
  },
  async me() {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    return data.data;
  },
  async logout() {
    await api.post('/auth/logout');
  },
};
