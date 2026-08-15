// Server-side auth indirection. In LOCAL_MODE a static local user is
// returned and the Neon Auth SDK is never loaded, so no request leaves
// the machine.
export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export async function getUser(): Promise<AuthUser | null> {
  if (process.env.LOCAL_MODE === 'true') {
    return { id: 'local-user', name: 'Local', email: 'local@localhost' };
  }
  const { neonAuth } = await import('@neondatabase/auth/next/server');
  const { user } = await neonAuth();
  return user ?? null;
}
