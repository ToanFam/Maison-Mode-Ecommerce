import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border bg-card p-8 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-lg bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="mt-4 text-xl font-semibold tracking-normal">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
