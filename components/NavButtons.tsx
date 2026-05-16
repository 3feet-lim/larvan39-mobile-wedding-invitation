import { siteConfig } from '@/lib/config';

export function NavButtons() {
  const { lat, lng, venue } = siteConfig;
  const encoded = encodeURIComponent(venue);
  const links = [
    { label: '네이버지도', href: `nmap://route/public?lat=${lat}&lng=${lng}&name=${encoded}` },
    { label: '티맵', href: `tmap://route?goalname=${encoded}&goalx=${lng}&goaly=${lat}` },
    { label: '카카오내비', href: `kakaonavi://navigate?name=${encoded}&x=${lng}&y=${lat}&coord_type=wgs84` },
  ];
  const webFallback = `https://map.naver.com/p/search/${encodeURIComponent(siteConfig.address)}`;

  return (
    <div className="grid grid-cols-1 gap-3">
      {links.map((link) => <a key={link.label} className="line-button" href={link.href}>{link.label}</a>)}
      <a className="line-button border-accent text-accent" href={webFallback} target="_blank" rel="noreferrer">웹 지도 열기</a>
    </div>
  );
}
