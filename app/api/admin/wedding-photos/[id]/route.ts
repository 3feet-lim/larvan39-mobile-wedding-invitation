import { NextResponse } from 'next/server';
import { requireAdmin, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deleteObject } from '@/lib/s3';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const { id } = await context.params;
  const body = await request.json().catch(() => null) as { displayOrder?: number } | null;
  if (!Number.isFinite(body?.displayOrder)) return NextResponse.json({ error: 'displayOrder가 필요합니다.' }, { status: 400 });
  const photo = await prisma.weddingPhoto.update({ where: { id }, data: { displayOrder: Number(body?.displayOrder) } });
  return NextResponse.json({ photo });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const { id } = await context.params;
  const photo = await prisma.weddingPhoto.delete({ where: { id } });
  await deleteObject('wedding', photo.fileKey).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
