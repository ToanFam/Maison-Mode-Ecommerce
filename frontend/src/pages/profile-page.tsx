import { Package, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';

import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { orderService } from '@/services/order.service';
import { useAuthStore } from '@/store/auth.store';
import type { Order } from '@/types/order';

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    orderService
      .mine()
      .then((data) => {
        if (mounted) setOrders(data);
      })
      .catch(() => {
        if (mounted) setError('Unable to load your orders.');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="container py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-foreground">
          <UserRound className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">Account</p>
          <h1 className="text-4xl font-bold tracking-normal">Profile</h1>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Personal details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <Badge>{user?.role}</Badge>
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-4 text-2xl font-bold tracking-normal">Recent orders</h2>
          {error && <ErrorState message={error} />}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-28 w-full" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No orders yet"
              description="Orders will appear here once you complete checkout."
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()} / {order.items.length}{' '}
                        items
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{order.status}</Badge>
                      <p className="font-semibold">${order.total.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
