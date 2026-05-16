import type { NextConfig } from 'next';

function remotePatternFrom(url?: string) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return {
      protocol: parsed.protocol.replace(':', '') as 'http' | 'https',
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: '/**',
    };
  } catch {
    return null;
  }
}

const configured = [process.env.S3_PUBLIC_ENDPOINT, process.env.NEXT_PUBLIC_SITE_URL]
  .map(remotePatternFrom)
  .filter(Boolean) as NonNullable<NextConfig['images']>['remotePatterns'];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: configured.length
      ? configured
      : [{ protocol: 'http', hostname: 'localhost', port: '9000', pathname: '/**' }],
  },
};

export default nextConfig;
