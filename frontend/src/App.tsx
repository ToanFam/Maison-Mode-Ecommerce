import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { AppLayout } from '@/components/layout/app-layout';
import { ToastProvider } from '@/components/ui/toast';
import { AdminPage } from '@/pages/admin-page';
import { CartPage } from '@/pages/cart-page';
import { CheckoutPage } from '@/pages/checkout-page';
import { HomePage } from '@/pages/home-page';
import { LoginPage } from '@/pages/login-page';
import { ProfilePage } from '@/pages/profile-page';
import { ProductDetailPage } from '@/pages/product-detail-page';
import { ProductsPage } from '@/pages/products-page';
import { RegisterPage } from '@/pages/register-page';
import { UnauthorizedPage } from '@/pages/unauthorized-page';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { useThemeStore } from '@/store/theme.store';

export default function App() {
  const hydrateTheme = useThemeStore((state) => state.hydrateTheme);
  const hydrateSession = useAuthStore((state) => state.hydrateSession);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hydrateCart = useCartStore((state) => state.hydrateCart);
  const resetCart = useCartStore((state) => state.resetCart);

  useEffect(() => {
    hydrateTheme();
    hydrateSession();
  }, [hydrateSession, hydrateTheme]);

  useEffect(() => {
    if (isAuthenticated) {
      void hydrateCart();
    } else {
      resetCart();
    }
  }, [hydrateCart, isAuthenticated, resetCart]);

  return (
    <ToastProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route element={<ProtectedRoute requireAdmin />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Routes>
    </ToastProvider>
  );
}
