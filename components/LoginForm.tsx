'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    setLoading(false);
    if (!response.ok) {
      setError((await response.json()).error ?? '로그인 실패');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card mt-10 space-y-4 p-6">
      <label className="block text-sm text-muted">관리자 비밀번호</label>
      <input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button className="line-button w-full border-accent text-accent" disabled={loading}>{loading ? '확인 중...' : '로그인'}</button>
    </form>
  );
}
