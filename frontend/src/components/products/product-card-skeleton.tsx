import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-3">
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="mt-4 h-4 w-20" />
      <Skeleton className="mt-3 h-5 w-3/4" />
      <Skeleton className="mt-3 h-10 w-full" />
      <Skeleton className="mt-3 h-5 w-24" />
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
