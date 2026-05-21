import { Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ProductGrid } from '@/components/products/product-grid';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/hooks/useProducts';
import { productService } from '@/services/product.service';
import type { Category } from '@/types/product';

const pageSize = 12;

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const activeCategory = category === 'all' ? undefined : category;
  const { products, pageData, isLoading, error } = useProducts({
    search,
    category: activeCategory,
    page,
    size: pageSize,
  });

  useEffect(() => {
    productService
      .categories()
      .then((data) => {
        setCategories(data);
        setCategoryError(null);
      })
      .catch(() => setCategoryError('Categories are temporarily unavailable.'));
  }, []);

  const setSearchFilter = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const setCategoryFilter = (value: string) => {
    setCategory(value);
    setPage(0);
  };

  return (
    <section className="container py-10">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">Shop</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal">Modern fashion essentials</h1>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">
          Browse polished menswear, womenswear, shoes, and accessories from the live product catalog.
        </p>
      </div>

      <div className="mb-8 rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearchFilter(event.target.value)}
              placeholder="Search jackets, shirts, bags..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <SlidersHorizontal className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
            <Button
              variant={category === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter('all')}
            >
              All
            </Button>
            {categories.map((item) => (
              <Button
                key={item.id}
                variant={category === item.slug ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryFilter(item.slug)}
              >
                {item.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{pageData.totalElements} styles</Badge>
          {search && <Badge variant="outline">Search: {search}</Badge>}
          {category !== 'all' && <Badge variant="outline">Category: {category}</Badge>}
          {categoryError && <Badge variant="outline">{categoryError}</Badge>}
        </div>
      </div>

      <ProductGrid products={products} isLoading={isLoading} error={error} />

      {!isLoading && !error && pageData.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Page {pageData.page + 1} of {pageData.totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={pageData.first} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <Button variant="outline" disabled={pageData.last} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
