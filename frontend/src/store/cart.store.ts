import { create } from 'zustand';

import { cartService } from '@/services/cart.service';
import type { CartItem, CartResponse } from '@/types/cart';
import type { Product } from '@/types/product';

interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  hydrateCart: () => Promise<void>;
  addItem: (product: Product, size: string, color: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  resetCart: () => void;
}

const emptyCart = { items: [], subtotal: 0, itemCount: 0 };

const totalsFromItems = (items: CartItem[]) => ({
  subtotal: items.reduce((total, item) => total + item.product.price * item.quantity, 0),
  itemCount: items.reduce((total, item) => total + item.quantity, 0),
});

const applyCartResponse = (cart: CartResponse) => ({
  items: cart.items,
  subtotal: cart.subtotal,
  itemCount: cart.itemCount,
  error: null,
});

export const useCartStore = create<CartState>((set, get) => ({
  ...emptyCart,
  isLoading: false,
  isMutating: false,
  error: null,

  hydrateCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.getCart();
      set({ ...applyCartResponse(cart), isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Unable to load your cart.' });
    }
  },

  addItem: async (product, size, color, quantity = 1) => {
    const previousItems = get().items;
    const existingItem = previousItems.find(
      (item) => item.product.id === product.id && item.size === size && item.color === color,
    );
    const optimisticItems = existingItem
      ? previousItems.map((item) =>
          item.product.id === product.id && item.size === size && item.color === color
            ? {
                ...item,
                quantity: item.quantity + quantity,
                lineTotal: product.price * (item.quantity + quantity),
              }
            : item,
        )
      : [
          ...previousItems,
          {
            id: -Date.now(),
            product,
            quantity,
            size,
            color,
            lineTotal: product.price * quantity,
          },
        ];

    set({
      items: optimisticItems,
      ...totalsFromItems(optimisticItems),
      isMutating: true,
      error: null,
    });

    try {
      const cart = await cartService.addItem({ productId: product.id, quantity, size, color });
      set({ ...applyCartResponse(cart), isMutating: false });
    } catch {
      set({
        items: previousItems,
        ...totalsFromItems(previousItems),
        isMutating: false,
        error: 'Unable to add item.',
      });
      throw new Error('Unable to add item.');
    }
  },

  updateQuantity: async (itemId, quantity) => {
    const previousItems = get().items;
    const optimisticItems = previousItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantity: Math.max(1, quantity),
            lineTotal: item.product.price * Math.max(1, quantity),
          }
        : item,
    );

    set({
      items: optimisticItems,
      ...totalsFromItems(optimisticItems),
      isMutating: true,
      error: null,
    });

    try {
      const cart = await cartService.updateItem(itemId, { quantity: Math.max(1, quantity) });
      set({ ...applyCartResponse(cart), isMutating: false });
    } catch {
      set({
        items: previousItems,
        ...totalsFromItems(previousItems),
        isMutating: false,
        error: 'Unable to update quantity.',
      });
      throw new Error('Unable to update quantity.');
    }
  },

  removeItem: async (itemId) => {
    const previousItems = get().items;
    const optimisticItems = previousItems.filter((item) => item.id !== itemId);

    set({
      items: optimisticItems,
      ...totalsFromItems(optimisticItems),
      isMutating: true,
      error: null,
    });

    try {
      const cart = await cartService.removeItem(itemId);
      set({ ...applyCartResponse(cart), isMutating: false });
    } catch {
      set({
        items: previousItems,
        ...totalsFromItems(previousItems),
        isMutating: false,
        error: 'Unable to remove item.',
      });
      throw new Error('Unable to remove item.');
    }
  },

  clearCart: async () => {
    const previousItems = get().items;
    set({ ...emptyCart, isMutating: true, error: null });

    try {
      const cart = await cartService.clear();
      set({ ...applyCartResponse(cart), isMutating: false });
    } catch {
      set({
        items: previousItems,
        ...totalsFromItems(previousItems),
        isMutating: false,
        error: 'Unable to clear cart.',
      });
      throw new Error('Unable to clear cart.');
    }
  },

  resetCart: () => set({ ...emptyCart, isLoading: false, isMutating: false, error: null }),
}));
