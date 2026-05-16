'use client';

import { useState } from 'react';
import { siteConfig } from '@/lib/config';

export function AccountAccordion() {
  const [open, setOpen] = useState<string | null>(siteConfig.accounts[0]?.side ?? null);
  const copy = async (value: string) => navigator.clipboard?.writeText(value);

  return (
    <div className="space-y-3">
      {siteConfig.accounts.map((account) => (
        <div key={`${account.side}-${account.name}`} className="card overflow-hidden">
          <button className="flex w-full items-center justify-between p-5 text-left" onClick={() => setOpen(open === account.side ? null : account.side)}>
            <span className="font-serif text-lg">{account.side}</span>
            <span className="text-muted">{open === account.side ? '닫기' : '보기'}</span>
          </button>
          {open === account.side && (
            <div className="space-y-3 border-t border-line/10 p-5 text-sm">
              <p>{account.bank} · {account.number}</p>
              <p className="text-muted">예금주 {account.name}</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="line-button" onClick={() => copy(account.number)}>계좌 복사</button>
                <a className="line-button" href={account.kakaoPayUrl} target="_blank" rel="noreferrer">카카오페이</a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
