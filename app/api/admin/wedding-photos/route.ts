import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { requireAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createPutUrl, publicObjectUrl } from '@/lib/s3';

function ext(filename: string) {
  const match = filename.toLowerCase().match(/\.(jpe?g|png|webp|heic|gif)$/);
  return match?.[1] ?? 'jpg';
}

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  const photos = await prisma.weddingPhoto.findMany({ orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }] });
  return NextResponse.json({ photos: photos.map((photo) => ({ ...photo, url: publicObjectUrl('wedding', photo.fileKey) })) });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = await request.json().catch(() => null) as { filename?: string; contentType?: string } | null;
  if (!body?.filename || !body.contentType?.startsWith('image/')) return NextResponse.json({ error: '이미지 파일만 업로드할 수 있습니다.' }, { status: 400 });
  const count = await prisma.weddingPhoto.count();
  const fileKey = `wedding/${randomUUID()}.${ext(body.filename)}`;
  const photo = await prisma.weddingPhoto.create({ data: { fileKey, displayOrder: count + 1 } });
  const uploadUrl = await createPutUrl('wedding', fileKey, body.contentType);
  return NextResponse.json({ id: photo.id, uploadUrl, fileKey, expiresIn: 600 });
}
