import { create } from 'zustand';

import { AUTH_TOKEN_KEY, AUTH_USER_KEY, readStoredUser } from '@/lib/auth';
import type { User } from '@/types/auth';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setSession: (token: string, user: User) => void;
  clearSession: () => void;
  hydrateSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  setSession: (token, user) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    set({ token, user, isAuthenticated: true, isHydrated: true });
  },
  clearSession: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    set({ token: null, user: null, isAuthenticated: false, isHydrated: true });
  },
  hydrateSession: () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const user = readStoredUser();

    if (!token || !user) {
      set({ token: null, user: null, isAuthenticated: false, isHydrated: true });
      return;
    }

    set({ token, user, isAuthenticated: true, isHydrated: true });
  },
}));
