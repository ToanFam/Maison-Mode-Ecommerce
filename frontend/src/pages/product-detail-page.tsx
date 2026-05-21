import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ErrorState } from '@/components/common/error-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/useToast';
import { productService } from '@/services/product.service';
import { useCartStore } from '@/store/cart.store';
import type { Product } from '@/types/product';

export function ProductDetailPage() {
  const { productId } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const numericId = Number(productId);
    const request = Number.isFinite(numericId)
      ? productService.getById(numericId)
      : productService.getBySlug(productId);

    request
      .then((data) => {
        setProduct(data);
        setSelectedSize(data.sizes[0] ?? '');
        setSelectedColor(data.colors[0] ?? '');
        setQuantity(1);
        setError(null);
      })
      .catch(() => setError('Product not found.'));
  }, [productId]);

  if (error) {
    return (
      <div className="container py-16">
        <ErrorState message={error} />
      </div>
    );
  }

  if (!product) {
    return (
      <section className="container grid gap-10 py-10 lg:grid-cols-2">
        <Skeleton className="aspect-[4/5] w-full" />
        <div className="flex flex-col justify-center">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="mt-4 h-12 w-3/4" />
          <Skeleton className="mt-5 h-8 w-32" />
          <Skeleton className="mt-6 h-24 w-full" />
          <Skeleton className="mt-8 h-12 w-full sm:w-48" />
        </div>
      </section>
    );
  }

  const stockQuantity = product.stockQuantity ?? product.stock ?? 0;
  const isOutOfStock = stockQuantity <= 0;
  const maxQuantity = Math.max(1, Math.min(stockQuantity, 10));

  const addToCart = async () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    try {
      await addItem(product, selectedSize, selectedColor, quantity);
      toast({
        title: 'Added to cart',
        description: `${quantity} x ${product.name} in ${selectedColor}, size ${selectedSize}.`,
        variant: 'success',
      });
    } catch {
      toast({
        title: 'Could not add item',
        description: 'Please sign in and confirm this item is still in stock.',
        variant: 'error',
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section className="container grid gap-10 py-10 lg:grid-cols-2">
      <div className="overflow-hidden rounded-lg bg-muted">
        <img
          src={product.imageUrl}
          alt={product.name}
          fetchPriority="high"
          decoding="async"
          className="aspect-[4/5] w-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-center">
        <Badge variant="outline" className="w-fit">
          {product.categoryName ?? product.category.toLowerCase()}
        </Badge>
        <h1 className="mt-4 text-4xl font-bold tracking-normal">{product.name}</h1>
        <div className="mt-4 flex items-baseline gap-3">
          <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>
          {product.compareAtPrice > product.price && (
            <p className="text-sm text-muted-foreground line-through">
              ${product.compareAtPrice.toFixed(2)}
            </p>
          )}
        </div>
        <p className="mt-6 leading-7 text-muted-foreground">{product.description}</p>

        <div className="mt-6 rounded-lg border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="font-medium">Stock quantity</span>
            <span className={isOutOfStock ? 'text-destructive' : 'text-muted-foreground'}>
              {isOutOfStock ? 'Out of stock' : `${stockQuantity} available`}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          <div>
            <p className="mb-3 text-sm font-medium">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? 'default' : 'outline'}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium">Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? 'secondary' : 'outline'}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium">Quantity</p>
            <div className="flex w-fit items-center rounded-md border bg-background">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={quantity <= 1}
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-sm font-medium">{quantity}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={quantity >= maxQuantity || isOutOfStock}
                onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Button
          className="mt-8 w-full sm:w-fit"
          size="lg"
          onClick={addToCart}
          disabled={isAdding || isOutOfStock}
        >
          <ShoppingBag className="h-4 w-4" />
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </Button>
      </div>
    </section>
  );
}
