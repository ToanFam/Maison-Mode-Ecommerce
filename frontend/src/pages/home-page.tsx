import { ArrowRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ProductGrid } from '@/components/products/product-grid';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';

const values = [
  {
    icon: Sparkles,
    title: 'Curated drops',
    text: 'Fresh capsules with precise edits, not endless scrolling.',
  },
  {
    icon: Truck,
    title: 'Fast delivery',
    text: 'Domestic orders ship quickly from our regional fulfillment team.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure checkout',
    text: 'JWT-backed accounts and protected API access are built in.',
  },
];

export function HomePage() {
  const { products, isLoading, error } = useProducts({ featured: true, size: 4 });

  return (
    <div>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-secondary text-secondary-foreground">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85"
          alt="Fashion storefront"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-secondary/20" />
        <div className="container relative flex min-h-[calc(100vh-4rem)] items-center py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-normal text-secondary-foreground/80">
              Spring capsule
            </p>
            <h1 className="mt-4 text-5xl font-bold leading-tight tracking-normal md:text-7xl">
              Maison Mode
            </h1>
            <p className="mt-6 max-w-xl text-lg text-secondary-foreground/82">
              Refined essentials, structured layers, and statement accessories for a wardrobe that
              works from weekday to evening.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/products">
                  Shop collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-secondary-foreground/30 bg-transparent"
                asChild
              >
                <Link to="/register">Create account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {values.map((item) => (
            <div key={item.title} className="rounded-lg border bg-card p-5">
              <item.icon className="h-5 w-5 text-primary" />
              <h2 className="mt-4 font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">Featured</p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal">New season edits</h2>
          </div>
          <Button variant="link" asChild>
            <Link to="/products">View all</Link>
          </Button>
        </div>
        <ProductGrid
          products={products.slice(0, 4)}
          isLoading={isLoading}
          error={error}
          skeletonCount={4}
        />
      </section>
    </div>
  );
}
