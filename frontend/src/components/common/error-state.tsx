import { AlertTriangle } from 'lucide-react';

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-destructive">
      <AlertTriangle className="mt-0.5 h-5 w-5" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
