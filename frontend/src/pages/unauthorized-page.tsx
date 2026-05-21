import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function UnauthorizedPage() {
  return (
    <section className="container flex min-h-[calc(100vh-9rem)] items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Access denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your account does not have permission to access this area.
          </p>
          <Button asChild>
            <Link to="/products">Back to shop</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
