import { AdminDashboard } from '@/components/AdminDashboard';

export default function AdminPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return (
    <main className="mobile-shell px-6 py-10">
      <h1 className="font-serif text-3xl">관리자 대시보드</h1>
      <div className="mt-8"><AdminDashboard uploadUrl={`${baseUrl.replace(/\/$/, '')}/upload`} /></div>
    </main>
  );
}
