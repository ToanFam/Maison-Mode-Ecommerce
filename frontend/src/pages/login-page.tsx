import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { authRedirectFor } from '@/lib/auth';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, setSession, user } = useAuthStore();
  const [email, setEmail] = useState('customer@maison.test');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(authRedirectFor(user), { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const session = await authService.login({ email, password });
      setSession(session.token, session.user);
      const state = location.state as { from?: { pathname?: string } } | null;
      const redirect =
        state?.from?.pathname ?? searchParams.get('redirect') ?? authRedirectFor(session.user);
      navigate(redirect, { replace: true });
    } catch {
      setError('Unable to sign in with those credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container flex min-h-[calc(100vh-9rem)] items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to continue shopping and manage your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            New here?{' '}
            <Link to="/register" className="font-medium text-primary">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
