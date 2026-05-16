import { NextResponse } from 'next/server';
import { clearSessionCookie, requireAdmin, unauthorized } from '@/lib/auth';

export async function POST() {
  if (!(await requireAdmin())) return unauthorized();
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
