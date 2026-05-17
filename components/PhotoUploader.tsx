'use client';

import imageCompression from 'browser-image-compression';
import { useState } from 'react';

type Mode = 'guest' | 'wedding';
type Item = { file: File; name: string; status: string; progress: number; error?: string };

export function PhotoUploader({ mode, onDone }: { mode: Mode; onDone?: () => void }) {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);

  async function uploadFile(file: File, index: number) {
    const maxWidthOrHeight = mode === 'wedding' ? 2400 : 1920;
    const maxSizeMB = mode === 'wedding' ? 2 : 1.6;
    const update = (patch: Partial<Item>) => setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));

    update({ status: '압축 중', progress: 10 });
    const compressed = await imageCompression(file, {
      maxWidthOrHeight,
      maxSizeMB,
      initialQuality: mode === 'wedding' ? 0.8 : 0.75,
      useWebWorker: true,
      onProgress: (progress) => update({ progress: Math.max(10, Math.round(progress * 0.45)) }),
    });

    update({ status: '업로드 URL 요청 중', progress: 50 });
    const presignPath = mode === 'wedding' ? '/api/admin/wedding-photos' : '/api/upload/presigned';
    const presigned = await fetch(presignPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, contentType: compressed.type || file.type || 'image/jpeg', fileSize: compressed.size }),
    });
    if (!presigned.ok) throw new Error((await presigned.json()).error ?? 'presigned URL 발급 실패');
    const { uploadUrl, fileKey, id } = await presigned.json();

    update({ status: 'S3 업로드 중', progress: 65 });
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', compressed.type || file.type || 'image/jpeg');
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) update({ progress: 65 + Math.round((event.loaded / event.total) * 25) });
      };
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error('S3 업로드 실패')));
      xhr.onerror = () => reject(new Error('네트워크 오류'));
      xhr.send(compressed);
    });

    if (mode === 'guest') {
      update({ status: '저장 중', progress: 95 });
      const completed = await fetch('/api/upload/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKey, originalName: file.name, fileSize: compressed.size }),
      });
      if (!completed.ok) throw new Error((await completed.json()).error ?? '메타데이터 저장 실패');
    }

    update({ status: id ? '완료' : '감사합니다', progress: 100 });
  }

  async function uploadFiles(nextItems: Item[]) {
    setBusy(true);
    for (let i = 0; i < nextItems.length; i += 1) {
      try {
        if (nextItems[i].status === '완료' || nextItems[i].status === '감사합니다') continue;
        await uploadFile(nextItems[i].file, i);
      } catch (error) {
        setItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, status: '실패', error: error instanceof Error ? error.message : '오류' } : item)));
      }
    }
    setBusy(false);
    onDone?.();
  }

  async function onSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const nextItems = Array.from(event.target.files ?? []).map((file) => ({ file, name: file.name, status: '대기', progress: 0 }));
    setItems(nextItems);
    await uploadFiles(nextItems);
  }

  async function retry(index: number) {
    const nextItems = items.map((item, idx) => (idx === index ? { ...item, status: '대기', progress: 0, error: undefined } : item));
    setItems(nextItems);
    await uploadFiles(nextItems);
  }

  return (
    <div className="space-y-5">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-accent p-10 text-center">
        <span className="font-serif text-xl">사진 선택</span>
        <span className="mt-2 text-sm text-muted">여러 장을 한 번에 선택할 수 있습니다.</span>
        <input className="sr-only" type="file" multiple accept="image/*" onChange={onSelect} disabled={busy} />
      </label>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.name} className="card p-4">
            <div className="flex justify-between gap-4 text-sm"><span className="truncate">{item.name}</span><span>{item.status}</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-accent/15"><div className="h-full bg-accent" style={{ width: `${item.progress}%` }} /></div>
            {item.error && (
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <p className="text-red-700">{item.error}</p>
                <button className="line-button py-2" type="button" onClick={() => retry(items.indexOf(item))} disabled={busy}>재시도</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
