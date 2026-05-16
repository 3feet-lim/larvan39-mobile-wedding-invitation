import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createPutUrl } from '@/lib/s3';
import { rateLimit } from '@/lib/rate-limit';

function ext(filename: string) {
  const match = filename.toLowerCase().match(/\.(jpe?g|png|webp|heic|gif)$/);
  return match?.[1] ?? 'jpg';
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'local';
  if (!rateLimit(`upload:${ip}`, 20)) return NextResponse.json({ error: 'Too many uploads. 잠시 후 다시 시도해주세요.' }, { status: 429 });
  const body = await request.json().catch(() => null) as { filename?: string; contentType?: string } | null;
  if (!body?.filename || !body.contentType?.startsWith('image/')) return NextResponse.json({ error: '이미지 파일만 업로드할 수 있습니다.' }, { status: 400 });
  const fileKey = `guest/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${ext(body.filename)}`;
  const uploadUrl = await createPutUrl('guest', fileKey, body.contentType);
  return NextResponse.json({ uploadUrl, fileKey, expiresIn: 600 });
}
