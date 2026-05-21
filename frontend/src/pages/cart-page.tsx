import { ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/useToast';
import { useCartStore } from '@/store/cart.store';

export function CartPage() {
  const { toast } = useToast();
  const { items, subtotal, isLoading, isMutating, error, updateQuantity, removeItem, clearCart } =
    useCartStore();

  const onUpdateQuantity = async (itemId: number, quantity: number) => {
    try {
      await updateQuantity(itemId, quantity);
    } catch {
      toast({
        title: 'Quantity was not updated',
        description: 'The requested quantity may exceed available stock.',
        variant: 'error',
      });
    }
  };

  const onRemoveItem = async (itemId: number) => {
    try {
      await removeItem(itemId);
      toast({ title: 'Removed from cart', variant: 'success' });
    } catch {
      toast({ title: 'Could not remove item', variant: 'error' });
    }
  };

  const onClearCart = async () => {
    try {
      await clearCart();
      toast({ title: 'Cart cleared', variant: 'success' });
    } catch {
      toast({ title: 'Could not clear cart', variant: 'error' });
    }
  };

  return (
    <section className="container py-10">
      <h1 className="text-4xl font-bold tracking-normal">Shopping cart</h1>
      {error && (
        <div className="mt-6">
          <ErrorState message={error} />
        </div>
      )}
      {isLoading ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-36 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Add a few favorite pieces before heading to checkout."
            action={
              <Button asChild>
                <Link to="/products">Start shopping</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={`${item.product.id}-${item.size}-${item.color}`}>
                <CardContent className="flex gap-4 p-4">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    loading="lazy"
                    decoding="async"
                    className="h-28 w-24 rounded-md object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">{item.product.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {item.size} / {item.color}
                      </p>
                    </div>
                    <div className="flex w-28 items-center gap-2">
                      <span className="text-sm text-muted-foreground">Qty</span>
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) =>
                          void onUpdateQuantity(item.id, Number(event.target.value))
                        }
                        className="h-9"
                        disabled={isMutating}
                      />
                    </div>
                    <p className="font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => void onRemoveItem(item.id)}
                    disabled={isMutating}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Calculated later</span>
              </div>
              <div className="flex justify-between border-t pt-4 text-lg font-semibold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <Button className="w-full" asChild>
                <Link to="/checkout">Checkout</Link>
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => void onClearCart()}
                disabled={isMutating}
              >
                Clear cart
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
