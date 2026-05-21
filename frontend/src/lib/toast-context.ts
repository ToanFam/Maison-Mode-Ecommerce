import { createContext } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

export interface ToastContextValue {
  toast: (toast: Omit<ToastMessage, 'id' | 'variant'> & { variant?: ToastVariant }) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
