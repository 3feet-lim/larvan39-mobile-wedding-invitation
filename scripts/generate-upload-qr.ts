import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import QRCode from 'qrcode';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const uploadUrl = `${siteUrl.replace(/\/$/, '')}/upload`;
const outDir = path.join(process.cwd(), 'public', 'generated');
await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, 'upload-qr.png'), await QRCode.toBuffer(uploadUrl, { width: 1024, margin: 2 }));
console.log(`Generated QR for ${uploadUrl} at public/generated/upload-qr.png`);
