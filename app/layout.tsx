import type { Metadata, Viewport } from 'next';
import './globals.css';


export const metadata: Metadata = {
  title: 'Mobile Wedding Invitation',
  description: '모바일 청첩장과 하객 사진 업로드',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
