export type ProductCategory = 'MEN' | 'WOMEN' | 'SHOES' | 'ACCESSORIES';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number;
  imageUrl: string;
  category: ProductCategory;
  categoryId?: number;
  categoryName?: string;
  categorySlug?: string;
  sizes: string[];
  colors: string[];
  stock: number;
  stockQuantity: number;
  featured: boolean;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
