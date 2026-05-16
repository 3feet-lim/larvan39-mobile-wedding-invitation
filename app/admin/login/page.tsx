import Link from 'next/link';
import { LoginForm } from '@/components/LoginForm';

export default function AdminLoginPage() {
  return (
    <main className="mobile-shell px-6 py-12">
      <Link href="/" className="text-sm text-muted">← 청첩장</Link>
      <h1 className="mt-10 font-serif text-3xl">관리자 로그인</h1>
      <LoginForm />
    </main>
  );
}
