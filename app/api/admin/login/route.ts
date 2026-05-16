import { NextResponse } from 'next/server';
import { setSessionCookie, verifyPassword } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { password?: string } | null;
  if (!verifyPassword(body?.password ?? '')) return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  setSessionCookie(response);
  return response;
}
