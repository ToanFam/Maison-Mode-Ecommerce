export interface AdminStats {
  users: number;
  products: number;
  orders: number;
}

export interface CategoryOption {
  id: number;
  name: string;
  slug: string;
}

export interface ProductPayload {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number;
  imageUrl: string;
  categorySlug: string;
  sizes: string[];
  colors: string[];
  stockQuantity: number;
  featured: boolean;
  active: boolean;
}
