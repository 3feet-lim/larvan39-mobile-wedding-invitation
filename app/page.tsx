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
  const heroPhotoUrl = galleryPhotos[0]?.url ?? '/hero-photo-fallback.png';

  return (
    <main className="mobile-shell paper-texture">
      <section className="hero-section text-center">
        <p className="hero-date">· 20260906 ·</p>
        <h1 className="hero-title">WEDDING INVITATION</h1>
        <div className="hero-arch no-callout">
          <Image
            src={heroPhotoUrl}
            alt={`${siteConfig.groom.ko} ${siteConfig.bride.ko} 웨딩 사진`}
            fill
            sizes="(max-width: 480px) 76vw, 360px"
            className="object-cover"
            priority
            draggable={false}
          />
        </div>
        <p className="mt-10 font-display text-sm tracking-[0.38em] text-muted">SAVE THE DATE</p>
        <h2 className="mt-5 font-serif text-4xl leading-tight text-ink">{siteConfig.groom.ko} <span className="font-display text-3xl text-muted">&amp;</span> {siteConfig.bride.ko}</h2>
        <p className="mt-4 leading-8 text-muted">{siteConfig.dateTime}<br />{siteConfig.venue}</p>
      </section>

      <section className="section text-center">
        <p className="section-kicker">INVITATION</p>
        <h2 className="font-serif text-2xl">초대합니다</h2>
        <p className="mt-8 whitespace-pre-line leading-8 text-muted">{siteConfig.greeting}</p>
      </section>

      <section className="section text-center">
        <p className="section-kicker">WITH FAMILY</p>
        <h2 className="font-serif text-2xl">함께하는 사람들</h2>
        <div className="mt-8 space-y-4 leading-8 text-muted">
          <p>{siteConfig.families.groomParents}</p>
          <p>{siteConfig.families.brideParents}</p>
        </div>
      </section>

      <section className="section">
        <p className="section-kicker text-center">GALLERY</p>
        <h2 className="mb-8 text-center font-serif text-2xl">Gallery</h2>
        <Gallery photos={galleryPhotos} />
      </section>

      <section className="section">
        <p className="section-kicker text-center">LOCATION</p>
        <h2 className="mb-6 text-center font-serif text-2xl">오시는 길</h2>
        <div className="mb-5 rounded-[28px] border border-line/15 bg-white/35 p-6 text-center shadow-soft backdrop-blur-sm">
          <p className="font-serif text-xl">{siteConfig.venue}</p>
          <p className="mt-3 leading-7 text-muted">{siteConfig.address}</p>
          <p className="mt-3 text-xs text-muted">아래 버튼을 누르면 지도/내비 앱으로 연결됩니다.</p>
        </div>
        <NavButtons />
      </section>

      <section className="section">
        <p className="section-kicker text-center">ACCOUNT</p>
        <h2 className="mb-6 text-center font-serif text-2xl">마음 전하실 곳</h2>
        <AccountAccordion />
      </section>

      <section className="section pb-20 text-center">
        <p className="section-kicker">SHARE PHOTO</p>
        <h2 className="font-serif text-2xl">사진을 공유해주세요</h2>
        <p className="mt-5 leading-7 text-muted">결혼식 당일 찍으신 사진을 공유해주시면 오래도록 소중히 간직하겠습니다.</p>
        <Link className="line-button mt-8 border-accent text-accent" href="/upload">하객 사진 업로드</Link>
      </section>
    </main>
  );
}
