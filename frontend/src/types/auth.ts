export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'CUSTOMER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}
