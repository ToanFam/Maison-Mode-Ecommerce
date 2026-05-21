import { SearchX } from 'lucide-react';

import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { ProductCard } from '@/components/products/product-card';
import { ProductCardSkeleton } from '@/components/products/product-card-skeleton';
import type { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error?: string | null;
  skeletonCount?: number;
}

export function ProductGrid({ products, isLoading, error, skeletonCount = 8 }: ProductGridProps) {
  if (error) return <ErrorState message={error} />;

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No products found"
        description="Try a different search term or remove a category filter."
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
