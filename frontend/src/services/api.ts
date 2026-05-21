import axios from 'axios';

import { AUTH_TOKEN_KEY } from '@/lib/auth';
import { env } from '@/lib/env';
import { useAuthStore } from '@/store/auth.store';

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token ?? localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      useAuthStore.getState().clearSession();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      }
    }

    if (status === 403 && !window.location.pathname.startsWith('/unauthorized')) {
      window.location.assign('/unauthorized');
    }

    return Promise.reject(error);
  },
);
