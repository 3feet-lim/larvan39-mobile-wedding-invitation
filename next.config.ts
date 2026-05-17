import type { NextConfig } from 'next';

type ImageRemotePattern = { protocol: 'http' | 'https'; hostname: string; port: string; pathname: string };

function remotePatternFrom(url?: string): ImageRemotePattern | null {
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
  .filter((pattern): pattern is ImageRemotePattern => Boolean(pattern));

const nextConfig: NextConfig = {
  images: {
    remotePatterns: configured.length
      ? configured
      : [{ protocol: 'http', hostname: 'localhost', port: '9000', pathname: '/**' }],
  },
};

export default nextConfig;
