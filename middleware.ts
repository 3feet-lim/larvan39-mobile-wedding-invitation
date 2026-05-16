import { NextRequest, NextResponse } from 'next/server';

function hex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function sign(value: string) {
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || 'dev-only-secret';
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)));
}

async function isValidSession(value?: string) {
  if (!value) return false;
  const [body, signature] = value.split('.');
  if (!body || !signature || (await sign(body)) !== signature) return false;
  try {
    const payload = JSON.parse(atob(body.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number };
    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== '/admin') return NextResponse.next();
  const session = request.cookies.get('wedding_admin_session')?.value;
  if (await isValidSession(session)) return NextResponse.next();
  return NextResponse.redirect(new URL('/admin/login', request.url));
}

export const config = { matcher: ['/admin'] };
