'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export type GalleryPhoto = { id: string; url: string };

export function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const prevent = (event: Event) => event.preventDefault();
    document.addEventListener('gesturestart', prevent, { passive: false });
    return () => document.removeEventListener('gesturestart', prevent);
  }, []);

  if (photos.length === 0) {
    return <div className="card flex aspect-[4/5] items-center justify-center p-8 text-center text-sm text-muted">관리자 페이지에서 웨딩사진을 업로드하면 이곳에 표시됩니다.</div>;
  }

  const photo = photos[index];
  const goPrevious = () => setIndex((index + photos.length - 1) % photos.length);
  const goNext = () => setIndex((index + 1) % photos.length);

  return (
    <div className="no-callout" onContextMenu={(event) => event.preventDefault()}>
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line/20 bg-white/30 touch-pan-x"
        onTouchStart={(event) => {
          if (event.touches.length === 1) touchStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;
          const delta = event.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(delta) < 40) return;
          if (delta > 0) goPrevious();
          else goNext();
        }}
      >
        <Image src={photo.url} alt="웨딩사진" fill sizes="(max-width: 480px) 100vw, 480px" className="object-cover" draggable={false} priority={index === 0} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <button className="line-button" onClick={goPrevious}>이전</button>
        <div className="text-sm text-muted">{index + 1} / {photos.length}</div>
        <button className="line-button" onClick={goNext}>다음</button>
      </div>
      <div className="mt-3 flex justify-center gap-2">
        {photos.map((item, itemIndex) => <span key={item.id} className={`h-2 w-2 rounded-full ${itemIndex === index ? 'bg-accent' : 'bg-accent/25'}`} />)}
      </div>
    </div>
  );
}
