import { LoginForm } from '@/components/login-form';
import { Stethoscope } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Stethoscope className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-headline text-3xl font-bold text-primary">ClinicFlow</h1>
          <p className="text-muted-foreground">Streamlining your clinic's daily operations.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
