'use client';

import './polyfills';

const LOCAL_MODE = process.env.NEXT_PUBLIC_LOCAL_MODE === 'true';

const localUser = { id: 'local-user', name: 'Local', email: 'local@localhost' };

// In LOCAL_MODE the Neon Auth client is replaced by a stub that always
// reports a signed-in static user, so no request leaves the machine and
// sign-in redirects never trigger.
const localAuthClient = {
  getSession: async () => ({ data: { user: localUser, session: {} }, error: null }),
  signOut: async () => ({}),
  useSession: () => ({ data: { user: localUser, session: {} }, isPending: false, error: null }),
} as unknown as ReturnType<typeof import('@neondatabase/auth/next').createAuthClient>;

function makeAuthClient() {
  if (LOCAL_MODE) return localAuthClient;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createAuthClient } = require('@neondatabase/auth/next');
  return createAuthClient();
}

export const authClient = makeAuthClient();
