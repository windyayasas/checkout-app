import Link from 'next/link';
import { ShoppingBasket } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary p-3 shadow-inner">
                    <ShoppingBasket className="h-8 w-8 text-primary-foreground" />
                </div>
            </div>
            <CardTitle className="font-headline text-3xl">Family Grocery Hub</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-primary transition-colors hover:text-primary/80">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
