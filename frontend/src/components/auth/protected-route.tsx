import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { isAdmin } from '@/lib/auth';
import { useAuthStore } from '@/store/auth.store';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

export function ProtectedRoute({ requireAdmin = false }: ProtectedRouteProps) {
  const location = useLocation();
  const { isHydrated, isAuthenticated, user } = useAuthStore();

  if (!isHydrated) {
    return (
      <div className="container flex min-h-[calc(100vh-9rem)] items-center justify-center py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && !isAdmin(user)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
