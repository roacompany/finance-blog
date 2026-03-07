'use client';

import { useState } from 'react';
import Link from 'next/link';

const BENEFITS = [
  '전체 아카이브 무제한 열람',
  '시리즈 완결 글 전부 읽기',
  '금융 용어 해설 · 계산기',
  '새 글 이메일 알림 (선택)',
];

export default function MembershipPage() {
  const [email, setEmail]     = useState('');
  const [status, setStatus]   = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');

    const res = await fetch('/api/membership', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStatus('done');
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error ?? '오류가 발생했어요. 다시 시도해주세요.');
      setStatus('error');
    }
  }

  return (
    <div
      style={{ backgroundColor: 'var(--roa-bg-base)', minHeight: '100vh' }}
      className="flex flex-col items-center justify-center px-5 py-24"
    >
      {/* 뒤로가기 */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs mb-12 py-2 transition-colors roa-link"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        홈으로
      </Link>

      <div className="w-full" style={{ maxWidth: '440px' }}>

        {status === 'done' ? (
          /* ─── 완료 ─── */
          <div className="text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 mx-auto"
              style={{ backgroundColor: 'var(--roa-gold-muted)', border: '1px solid rgba(232,213,176,0.2)' }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
                <path d="M6 14l6 6L22 8" stroke="var(--roa-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1
              className="font-bold mb-3"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: 'var(--roa-text-primary)', letterSpacing: '-0.025em' }}
            >
              멤버가 되었어요
            </h1>
            <p className="text-sm mb-8" style={{ color: 'var(--roa-text-secondary)', lineHeight: 1.8 }}>
              이제 모든 아카이브 글을 제한 없이 읽을 수 있어요.<br />
              ROA Finance가 매일 새로운 인사이트를 전달할게요.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold min-h-[48px]"
              style={{ backgroundColor: 'var(--roa-gold)', color: '#0A0A0A' }}
            >
              아카이브 읽으러 가기
            </Link>
          </div>
        ) : (
          /* ─── 가입 폼 ─── */
          <>
            {/* 헤더 */}
            <div className="text-center mb-10">
              <p
                className="text-[10px] tracking-[0.22em] uppercase font-semibold mb-4"
                style={{ color: 'var(--roa-gold)' }}
              >
                ROA Finance
              </p>
              <h1
                className="font-bold mb-4 leading-tight"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.75rem, 6vw, 2.5rem)',
                  color: 'var(--roa-text-primary)',
                  letterSpacing: '-0.025em',
                }}
              >
                금융을 보는 눈을<br />갖게 되는 미디어
              </h1>
              <p className="text-sm" style={{ color: 'var(--roa-text-secondary)', lineHeight: 1.8 }}>
                이메일 하나로 무료 가입.<br />
                모든 아카이브와 시리즈를 제한 없이 읽어요.
              </p>
            </div>

            {/* 혜택 목록 */}
            <div
              className="rounded-2xl p-5 mb-8"
              style={{ backgroundColor: 'var(--roa-bg-elevated)', border: '1px solid var(--roa-border)' }}
            >
              <ul className="space-y-3">
                {BENEFITS.map(benefit => (
                  <li key={benefit} className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: 'var(--roa-gold-muted)' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                        <path d="M2 5l2 2 4-4" stroke="var(--roa-gold)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="text-sm" style={{ color: 'var(--roa-text-secondary)' }}>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 이메일 폼 */}
            <form onSubmit={handleSubmit}>
              <label htmlFor="email" className="sr-only">이메일 주소</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="이메일 주소"
                className="w-full px-4 py-3.5 rounded-xl text-sm mb-3 outline-none"
                style={{
                  backgroundColor: 'var(--roa-bg-elevated)',
                  border: '1px solid var(--roa-border)',
                  color: 'var(--roa-text-primary)',
                }}
              />
              {status === 'error' && (
                <p className="text-xs mb-3" style={{ color: '#f87171' }}>{message}</p>
              )}
              <button
                type="submit"
                disabled={status === 'loading' || !email}
                className="w-full py-3.5 rounded-full text-sm font-semibold min-h-[48px] transition-opacity disabled:opacity-50"
                style={{ backgroundColor: 'var(--roa-gold)', color: '#0A0A0A' }}
              >
                {status === 'loading' ? '처리 중...' : '무료로 멤버 가입하기'}
              </button>
            </form>

            <p className="text-center text-xs mt-4" style={{ color: 'var(--roa-text-tertiary)' }}>
              신용카드 불필요 · 이메일만으로 가입
            </p>
          </>
        )}
      </div>
    </div>
  );
}
