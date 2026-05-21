import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { ReactNode, useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ToastContext, ToastMessage } from '@/lib/toast-context';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (nextToast: Omit<ToastMessage, 'id' | 'variant'> & { variant?: ToastMessage['variant'] }) => {
      const id = crypto.randomUUID();
      setToasts((current) => [
        ...current,
        { id, variant: nextToast.variant ?? 'info', ...nextToast },
      ]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-20 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((item) => {
          const Icon =
            item.variant === 'success' ? CheckCircle2 : item.variant === 'error' ? XCircle : Info;

          return (
            <div
              key={item.id}
              className={cn(
                'rounded-lg border bg-card p-4 text-card-foreground shadow-soft',
                item.variant === 'success' && 'border-accent/40',
                item.variant === 'error' && 'border-destructive/40',
              )}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={cn(
                    'mt-0.5 h-5 w-5',
                    item.variant === 'success' && 'text-accent',
                    item.variant === 'error' && 'text-destructive',
                    item.variant === 'info' && 'text-primary',
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.title}</p>
                  {item.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => dismiss(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
