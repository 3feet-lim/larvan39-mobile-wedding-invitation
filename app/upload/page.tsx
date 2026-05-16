import Link from 'next/link';
import { PhotoUploader } from '@/components/PhotoUploader';

export default function UploadPage() {
  return (
    <main className="mobile-shell px-6 py-12">
      <Link href="/" className="text-sm text-muted">← 청첩장으로 돌아가기</Link>
      <h1 className="mt-10 font-serif text-3xl">하객 사진 업로드</h1>
      <p className="mt-4 leading-7 text-muted">업로드 전 브라우저에서 사진을 압축한 뒤 안전한 임시 URL로 저장합니다. 완료되면 감사합니다 메시지가 표시됩니다.</p>
      <div className="mt-10"><PhotoUploader mode="guest" /></div>
    </main>
  );
}
