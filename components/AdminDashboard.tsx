'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { PhotoUploader } from './PhotoUploader';

type WeddingPhoto = { id: string; fileKey: string; displayOrder: number; url: string };
type GuestPhoto = { id: string; fileKey: string; originalName: string | null; fileSize: number; uploadedAt: string; url: string };
type GuestPhotoResponse = { photos: GuestPhoto[]; page: number; pageSize: number; total: number };

export function AdminDashboard({ uploadUrl }: { uploadUrl: string }) {
  const [wedding, setWedding] = useState<WeddingPhoto[]>([]);
  const [guests, setGuests] = useState<GuestPhoto[]>([]);
  const [guestPage, setGuestPage] = useState(1);
  const [guestTotal, setGuestTotal] = useState(0);
  const [qr, setQr] = useState('');

  async function refresh(page = 1, append = false) {
    const [weddingResponse, guestResponse] = await Promise.all([fetch('/api/admin/wedding-photos'), fetch(`/api/admin/guest-photos?page=${page}&pageSize=30`)]);
    if (weddingResponse.ok) setWedding((await weddingResponse.json()).photos);
    if (guestResponse.ok) {
      const data = (await guestResponse.json()) as GuestPhotoResponse;
      setGuests((current) => (append ? [...current, ...data.photos] : data.photos));
      setGuestPage(data.page);
      setGuestTotal(data.total);
    }
  }

  useEffect(() => { refresh(); QRCode.toDataURL(uploadUrl, { width: 512, margin: 2 }).then(setQr); }, [uploadUrl]);

  async function updateOrder(id: string, displayOrder: number) {
    await fetch(`/api/admin/wedding-photos/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ displayOrder }) });
    refresh();
  }

  async function deleteWedding(id: string) { await fetch(`/api/admin/wedding-photos/${id}`, { method: 'DELETE' }); refresh(); }
  async function deleteGuest(id: string) { await fetch(`/api/admin/guest-photos/${id}`, { method: 'DELETE' }); refresh(); }
  async function logout() { await fetch('/api/admin/logout', { method: 'POST' }); location.href = '/admin/login'; }

  return (
    <div className="space-y-12">
      <div className="flex justify-end"><button className="line-button" onClick={logout}>로그아웃</button></div>

      <section className="space-y-5">
        <h2 className="font-serif text-2xl">웨딩촬영 사진 관리</h2>
        <PhotoUploader mode="wedding" onDone={refresh} />
        <div className="space-y-3">
          {wedding.map((photo) => (
            <div key={photo.id} className="card grid grid-cols-[80px_1fr] gap-4 p-4">
              <div className="relative h-24 overflow-hidden rounded-xl"><Image src={photo.url} alt="웨딩사진" fill sizes="80px" className="object-cover" /></div>
              <div className="space-y-3">
                <label className="block text-sm text-muted">표시 순서</label>
                <input className="input" type="number" value={photo.displayOrder} onChange={(event) => updateOrder(photo.id, Number(event.target.value))} />
                <button className="line-button" onClick={() => deleteWedding(photo.id)}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-2xl">하객 사진 관리</h2>
          <a className="line-button" href="/api/admin/guest-photos/download">ZIP 다운로드</a>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {guests.map((photo) => (
            <div key={photo.id} className="card overflow-hidden">
              <a className="relative block aspect-square" href={photo.url} target="_blank" rel="noreferrer"><Image src={photo.url} alt={photo.originalName ?? '하객 사진'} fill sizes="220px" className="object-cover" /></a>
              <div className="space-y-2 p-3 text-xs text-muted">
                <p>{new Date(photo.uploadedAt).toLocaleString('ko-KR')}</p>
                <a className="underline" href={photo.url} download>개별 다운로드</a>
                <button className="block text-red-700" onClick={() => deleteGuest(photo.id)}>삭제</button>
              </div>
            </div>
          ))}
        </div>
        {guests.length < guestTotal && (
          <button className="line-button w-full border-accent text-accent" type="button" onClick={() => refresh(guestPage + 1, true)}>
            더 보기 ({guests.length}/{guestTotal})
          </button>
        )}
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-2xl">업로드 QR 코드</h2>
        {qr && <a href={qr} download="upload-qr.png"><Image src={qr} alt="업로드 QR" width={240} height={240} className="rounded-2xl border bg-white p-2" unoptimized /></a>}
        <p className="break-all text-sm text-muted">{uploadUrl}</p>
      </section>
    </div>
  );
}
