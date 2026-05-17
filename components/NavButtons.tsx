'use client';

import { siteConfig } from '@/lib/config';

export function NavButtons() {
  const { lat, lng, venue } = siteConfig;
  const encoded = encodeURIComponent(venue);
  const appName = encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000');
  const links = [
    { label: '네이버지도', href: `nmap://navigation?dlat=${lat}&dlng=${lng}&dname=${encoded}&appname=${appName}` },
    { label: '티맵', href: `tmap://route?goalname=${encoded}&goalx=${lng}&goaly=${lat}` },
    { label: '카카오내비', href: `kakaonavi://navigate?name=${encoded}&x=${lng}&y=${lat}&coord_type=wgs84` },
  ];
  const webFallback = `https://map.naver.com/p/search/${encodeURIComponent(siteConfig.address)}`;
  const openWithFallback = (href: string) => {
    window.location.href = href;
    window.setTimeout(() => {
      if (document.visibilityState === 'visible') window.location.href = webFallback;
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {links.map((link) => (
        <button key={link.label} className="line-button" type="button" onClick={() => openWithFallback(link.href)}>
          {link.label}
        </button>
      ))}
      <a className="line-button border-accent text-accent" href={webFallback} target="_blank" rel="noreferrer">웹 지도 열기</a>
    </div>
  );
}
