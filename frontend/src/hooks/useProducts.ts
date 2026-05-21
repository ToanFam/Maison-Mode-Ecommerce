import { useEffect, useState } from 'react';

import { productService } from '@/services/product.service';
import type { PageResponse } from '@/types/api';
import type { Product } from '@/types/product';

interface UseProductsOptions {
  search?: string;
  category?: string;
  featured?: boolean;
  page?: number;
  size?: number;
}

const emptyPage: PageResponse<Product> = {
  content: [],
  page: 0,
  size: 12,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
};

export function useProducts(options: UseProductsOptions = {}) {
  const { search, category, featured, page, size } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [pageData, setPageData] = useState<PageResponse<Product>>(emptyPage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    productService
      .list({ search, category, featured, page, size })
      .then((data) => {
        if (mounted) {
          setProducts(data.content);
          setPageData(data);
          setError(null);
        }
      })
      .catch(() => {
        if (mounted) setError('Products are temporarily unavailable.');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [category, featured, page, search, size]);

  return { products, pageData, isLoading, error };
}
