import { CreditCard, ShoppingBag } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/useToast';
import { orderService } from '@/services/order.service';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const { items, subtotal, isLoading, resetCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shipping = subtotal > 250 ? 0 : 12;
  const total = subtotal + shipping;

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    try {
      const order = await orderService.checkout({
        shippingName: String(formData.get('shippingName') ?? ''),
        shippingAddress: String(formData.get('shippingAddress') ?? ''),
        shippingCity: String(formData.get('shippingCity') ?? ''),
        shippingCountry: String(formData.get('shippingCountry') ?? ''),
      });
      resetCart();
      toast({
        title: 'Order placed',
        description: `Order #${order.id} was created successfully.`,
        variant: 'success',
      });
      navigate('/profile', { replace: true });
    } catch {
      setError('Checkout failed. One or more items may be out of stock.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="container py-10">
        <Skeleton className="h-12 w-72" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-44 w-full" />
            <Skeleton className="h-44 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="container py-10">
        <EmptyState
          icon={ShoppingBag}
          title="No items to checkout"
          description="Your bag is empty. Browse the collection and add pieces before checkout."
          action={
            <Button asChild>
              <Link to="/products">Shop collection</Link>
            </Button>
          }
        />
      </section>
    );
  }

  return (
    <section className="container py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Secure checkout
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-normal">Complete your order</h1>
      </div>

      <form className="grid gap-8 lg:grid-cols-[1fr_380px]" onSubmit={submitOrder}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Input
                name="shippingName"
                defaultValue={user?.name ?? ''}
                placeholder="Full name"
                required
              />
              <Input defaultValue={user?.email ?? ''} type="email" placeholder="Email" required />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping address</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Input
                name="shippingAddress"
                className="sm:col-span-2"
                placeholder="Street address"
                required
              />
              <Input name="shippingCity" placeholder="City" required />
              <Input name="shippingCountry" placeholder="Country" required />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="relative sm:col-span-2">
                <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Card number"
                  defaultValue="4242 4242 4242 4242"
                  required
                />
              </div>
              <Input placeholder="MM / YY" defaultValue="12 / 30" required />
              <Input placeholder="CVC" defaultValue="123" required />
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    loading="lazy"
                    decoding="async"
                    className="h-16 w-14 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.size} / {item.color} / Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between border-t pt-3 text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            {error && <ErrorState message={error} />}
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Placing order...' : 'Place order'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </section>
  );
}
