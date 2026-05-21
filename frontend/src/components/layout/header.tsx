import { LogOut, Menu, ShieldCheck, ShoppingBag, UserRound } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { isAdmin } from '@/lib/auth';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop' },
];

export function Header() {
  const navigate = useNavigate();
  const itemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
  const { isAuthenticated, user, clearSession } = useAuthStore();
  const canAccessAdmin = isAdmin(user);

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearSession();
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold tracking-normal">
          Maison Mode
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                isActive
                  ? 'text-sm font-medium text-primary'
                  : 'text-sm font-medium text-muted-foreground hover:text-foreground'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          {canAccessAdmin && (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin" aria-label="Open admin dashboard">
                <ShieldCheck className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart" aria-label="Open cart" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Link>
          </Button>
          {isAuthenticated ? (
            <>
              <Button variant="outline" className="hidden sm:inline-flex" asChild>
                <Link to="/profile">{user?.name.split(' ')[0]}</Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button variant="outline" size="icon" asChild>
              <Link to="/login" aria-label="Login">
                <UserRound className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
