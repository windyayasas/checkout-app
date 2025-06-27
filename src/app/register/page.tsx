import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
             <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary p-3 shadow-inner">
                    <UserPlus className="h-8 w-8 text-primary-foreground" />
                </div>
            </div>
            <CardTitle className="font-headline text-3xl">Create an Account</CardTitle>
            <CardDescription>Join Family Grocery Hub today!</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary transition-colors hover:text-primary/80">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
