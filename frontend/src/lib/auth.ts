import type { User } from '@/types/auth';

export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_USER_KEY = 'auth_user';

export function isAdmin(user: User | null) {
  return user?.role === 'ADMIN';
}

export function authRedirectFor(user: User) {
  return user.role === 'ADMIN' ? '/admin' : '/products';
}

export function readStoredUser() {
  const userJson = localStorage.getItem(AUTH_USER_KEY);
  if (!userJson) return null;

  try {
    return JSON.parse(userJson) as User;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}
