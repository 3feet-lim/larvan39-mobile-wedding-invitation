import { NextResponse } from 'next/server';
import { requireAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deleteObject } from '@/lib/s3';

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const { id } = await context.params;
  const photo = await prisma.guestPhoto.delete({ where: { id } });
  await deleteObject('guest', photo.fileKey).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
