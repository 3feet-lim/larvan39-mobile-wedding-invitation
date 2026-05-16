import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { fileKey?: string; originalName?: string; fileSize?: number } | null;
  if (!body?.fileKey || !body.fileKey.startsWith('guest/')) return NextResponse.json({ error: '잘못된 파일 키입니다.' }, { status: 400 });
  const photo = await prisma.guestPhoto.create({
    data: { fileKey: body.fileKey, originalName: body.originalName, fileSize: Math.max(0, Number(body.fileSize ?? 0)) },
  });
  return NextResponse.json({ id: photo.id });
}
