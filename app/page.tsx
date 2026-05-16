import Image from 'next/image';
import Link from 'next/link';
import { AccountAccordion } from '@/components/AccountAccordion';
import { Gallery } from '@/components/Gallery';
import { NavButtons } from '@/components/NavButtons';
import { siteConfig } from '@/lib/config';
import { prisma } from '@/lib/prisma';
import { publicObjectUrl } from '@/lib/s3';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const photos = await prisma.weddingPhoto.findMany({ orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }] });
  const galleryPhotos = photos.map((photo) => ({ id: photo.id, url: publicObjectUrl('wedding', photo.fileKey) }));

  return (
    <main className="mobile-shell">
      <section className="flex min-h-screen flex-col items-center justify-center px-8 py-16 text-center">
        <Image src="/illustrations/botanical.svg" alt="botanical line drawing" width={220} height={80} priority />
        <p className="mt-8 font-display text-sm tracking-[0.5em] text-accent">WEDDING INVITATION</p>
        <h1 className="mt-6 font-serif text-4xl leading-tight">{siteConfig.groom.ko} &amp; {siteConfig.bride.ko}</h1>
        <p className="mt-2 font-display text-xl text-muted">{siteConfig.groom.en} · {siteConfig.bride.en}</p>
        <div className="mt-10 h-px w-16 bg-line" />
        <p className="mt-10 leading-8">{siteConfig.dateTime}<br />{siteConfig.venue}</p>
      </section>

      <section className="section text-center">
        <h2 className="font-serif text-2xl">초대합니다</h2>
        <p className="mt-8 whitespace-pre-line leading-8 text-muted">{siteConfig.greeting}</p>
      </section>

      <section className="section text-center">
        <h2 className="font-serif text-2xl">함께하는 사람들</h2>
        <div className="mt-8 space-y-4 leading-8">
          <p>{siteConfig.families.groomParents}</p>
          <p>{siteConfig.families.brideParents}</p>
        </div>
      </section>

      <section className="section">
        <h2 className="mb-8 text-center font-serif text-2xl">Gallery</h2>
        <Gallery photos={galleryPhotos} />
      </section>

      <section className="section text-center">
        <h2 className="font-serif text-2xl">일시와 장소</h2>
        <div className="mt-8 space-y-3 leading-7">
          <p>{siteConfig.dateTime}</p>
          <p>{siteConfig.venue}</p>
          <p className="text-muted">{siteConfig.address}</p>
        </div>
      </section>

      <section className="section">
        <h2 className="mb-6 text-center font-serif text-2xl">오시는 길</h2>
        <div className="mb-5 aspect-[16/10] rounded-[24px] border border-line/20 bg-white/40 p-5 text-center text-sm text-muted">
          지도 임베드 영역<br />좌표: {siteConfig.lat}, {siteConfig.lng}
        </div>
        <NavButtons />
      </section>

      <section className="section">
        <h2 className="mb-6 text-center font-serif text-2xl">마음 전하실 곳</h2>
        <AccountAccordion />
      </section>

      <section className="section text-center">
        <h2 className="font-serif text-2xl">사진을 공유해주세요</h2>
        <p className="mt-5 leading-7 text-muted">결혼식 당일 찍으신 사진을 공유해주시면 오래도록 소중히 간직하겠습니다.</p>
        <Link className="line-button mt-8 border-accent text-accent" href="/upload">하객 사진 업로드</Link>
      </section>
    </main>
  );
}
