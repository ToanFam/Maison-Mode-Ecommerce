import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getApiErrorMessage } from '@/lib/api-error';
import { authRedirectFor } from '@/lib/auth';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

export function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, setSession, user } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await authService.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      setSession(session.token, session.user);
      navigate(authRedirectFor(session.user), { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to create account. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container flex min-h-[calc(100vh-9rem)] items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Save your cart, checkout faster, and receive collection updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              required
            />
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
              minLength={8}
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Already registered?{' '}
            <Link to="/login" className="font-medium text-primary">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
