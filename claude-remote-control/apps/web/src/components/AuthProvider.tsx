'use client';

import { NeonAuthUIProvider } from '@neondatabase/auth/react/ui';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  if (process.env.NEXT_PUBLIC_LOCAL_MODE === 'true') {
    return <>{children}</>;
  }

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      social={{ providers: ['github'] }}
      navigate={(path: string) => router.push(path)}
      redirectTo="/"
      emailOTP
    >
      {children}
    </NeonAuthUIProvider>
  );
}
