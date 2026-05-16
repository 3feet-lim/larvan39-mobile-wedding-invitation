import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const COOKIE = 'wedding_admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 12;

function secret() {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || 'dev-only-secret';
}

function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('hex');
}

export function verifyPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD ?? '';
  if (!expected || !input) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function createSessionValue() {
  const payload = JSON.stringify({ role: 'admin', exp: Date.now() + MAX_AGE_SECONDS * 1000 });
  const body = Buffer.from(payload).toString('base64url');
  return `${body}.${sign(body)}`;
}

export function isValidSession(value?: string) {
  if (!value) return false;
  const [body, signature] = value.split('.');
  if (!body || !signature || sign(body) !== signature) return false;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as { exp?: number };
    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  const jar = await cookies();
  return isValidSession(jar.get(COOKIE)?.value);
}

export function setSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE, createSessionValue(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 });
}

export async function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
