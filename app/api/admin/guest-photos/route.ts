import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createGetUrl } from '@/lib/s3';

export async function GET(request: NextRequest) {
  if (!(await requireAdmin())) return unauthorized();
  const page = Math.max(1, Number(request.nextUrl.searchParams.get('page') ?? 1));
  const pageSize = Math.min(60, Math.max(1, Number(request.nextUrl.searchParams.get('pageSize') ?? 30)));
  const [total, photos] = await Promise.all([
    prisma.guestPhoto.count(),
    prisma.guestPhoto.findMany({ orderBy: { uploadedAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
  ]);
  const withUrls = await Promise.all(photos.map(async (photo) => ({ ...photo, url: await createGetUrl('guest', photo.fileKey) })));
  return NextResponse.json({ photos: withUrls, page, pageSize, total });
}
