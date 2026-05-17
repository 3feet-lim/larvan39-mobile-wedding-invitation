import JSZip from 'jszip';
import { NextResponse } from 'next/server';
import { requireAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { objectToBuffer } from '@/lib/s3';

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  const photos = await prisma.guestPhoto.findMany({ orderBy: { uploadedAt: 'desc' } });
  const zip = new JSZip();
  for (const photo of photos) {
    const data = await objectToBuffer('guest', photo.fileKey).catch(() => null);
    if (data) zip.file(photo.originalName || `${photo.id}.jpg`, data);
  }
  const buffer = await zip.generateAsync({ type: 'nodebuffer' });
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="guest-photos.zip"',
    },
  });
}
