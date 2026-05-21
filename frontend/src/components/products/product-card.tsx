import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { useCartStore } from '@/store/cart.store';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const categoryLabel = product.categoryName ?? product.category.toLowerCase();
  const stockQuantity = product.stockQuantity ?? product.stock ?? 0;
  const isOutOfStock = stockQuantity <= 0;

  const addToCart = async () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    try {
      await addItem(product, product.sizes[0], product.colors[0]);
      toast({
        title: 'Added to cart',
        description: `${product.name} is ready for checkout.`,
        variant: 'success',
      });
    } catch {
      toast({
        title: 'Could not add item',
        description: 'Please sign in and confirm the product is still in stock.',
        variant: 'error',
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/products/${product.id}`} className="block overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <CardContent className="flex flex-1 flex-col space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="outline" className="mb-2">
              {categoryLabel}
            </Badge>
            <Link
              to={`/products/${product.id}`}
              className="block font-semibold hover:text-primary"
            >
              {product.name}
            </Link>
          </div>
          <div className="text-right">
            <p className="font-semibold">${product.price.toFixed(2)}</p>
            {product.compareAtPrice > product.price && (
              <p className="text-xs text-muted-foreground line-through">
                ${product.compareAtPrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>
        <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">{product.description}</p>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className={isOutOfStock ? 'text-destructive' : 'text-muted-foreground'}>
            {isOutOfStock ? 'Out of stock' : `${stockQuantity} in stock`}
          </span>
        </div>
        <div className="mt-auto grid gap-2 sm:grid-cols-2">
          <Button variant="outline" asChild>
            <Link to={`/products/${product.id}`}>
              View Details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="secondary" onClick={addToCart} disabled={isAdding || isOutOfStock}>
            <ShoppingBag className="h-4 w-4" />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
