import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Lazy handler to avoid build-time env var requirement
async function createHandler(method: string) {
  if (process.env.LOCAL_MODE === 'true') {
    // Local mode: the Neon Auth API is never proxied. get-session reports
    // the static local user; everything else is a no-op.
    return async (request: NextRequest) => {
      if (request.nextUrl.pathname.endsWith('/get-session')) {
        return NextResponse.json({
          user: { id: 'local-user', name: 'Local', email: 'local@localhost' },
          session: {},
        });
      }
      return NextResponse.json({ ok: true });
    };
  }
  const { authApiHandler } = await import('@neondatabase/auth/next/server');
  const handlers = authApiHandler();
  return handlers[method as keyof typeof handlers];
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const handler = await createHandler('GET');
  return handler(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const handler = await createHandler('POST');
  const response = await handler(request, context);
  if (!response.ok) {
    const text = await response.clone().text();
    console.error('[Auth POST Error]', response.status, text);
  }
  return response;
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const handler = await createHandler('PUT');
  return handler(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const handler = await createHandler('DELETE');
  return handler(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const handler = await createHandler('PATCH');
  return handler(request, context);
}
