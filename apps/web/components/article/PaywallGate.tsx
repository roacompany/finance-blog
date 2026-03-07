'use client';

import Link from 'next/link';
import { useRef, useState, useLayoutEffect, type ReactNode } from 'react';
import { m } from 'framer-motion';

interface Props {
  children: ReactNode;
  isToday: boolean;           // 오늘 글 = 무료 공개
  threshold?: number;          // 0~1, 공개 비율 (default 0.52)
}

export function PaywallGate({ children, isToday, threshold = 0.52 }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);

  // useLayoutEffect: paint 전에 동기 실행 → 콘텐츠 flash 방지
  useLayoutEffect(() => {
    if (isToday) return;
    const el = contentRef.current;
    if (!el) return;

    const fullHeight = el.scrollHeight;
    setMaxHeight(Math.floor(fullHeight * threshold));
  }, [isToday, threshold]);

  // 오늘 글 — 페이월 없음
  if (isToday) return <>{children}</>;

  return (
    <div className="relative">
      {/* 콘텐츠 — max-height로 잘림 */}
      <div
        ref={contentRef}
        style={{
          maxHeight: maxHeight !== null ? `${maxHeight}px` : '9999px',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>

      {/* 페이월이 활성화된 경우에만 오버레이 표시 */}
      {maxHeight !== null && (
        <>
          {/* 블러 그라디언트 페이드 */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: `${Math.min(280, Math.floor(maxHeight * 0.45))}px`,
              background: 'linear-gradient(to bottom, transparent 0%, var(--roa-bg-base) 85%)',
            }}
          />

          {/* 멤버십 CTA 카드 */}
          <m.div
            className="relative z-10 mx-auto px-5 pb-20"
            style={{ maxWidth: '480px' }}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div
              className="rounded-2xl p-6 sm:p-8 text-center"
              style={{
                backgroundColor: 'var(--roa-bg-elevated)',
                border: '1px solid var(--roa-border)',
                boxShadow: '0 0 60px rgba(232,213,176,0.11)',
              }}
            >
              {/* 자물쇠 아이콘 */}
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-5 mx-auto"
                style={{
                  backgroundColor: 'var(--roa-gold-muted)',
                  border: '1px solid rgba(232,213,176,0.2)',
                }}
              >
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden>
                  <rect x="2" y="9" width="14" height="11" rx="2" stroke="var(--roa-gold)" strokeWidth="1.5"/>
                  <path d="M5 9V6a4 4 0 0 1 8 0v3" stroke="var(--roa-gold)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>

              <p
                className="text-[10px] tracking-[0.2em] uppercase font-semibold mb-3"
                style={{ color: 'var(--roa-gold)' }}
              >
                멤버 전용 콘텐츠
              </p>
              <h3
                className="font-bold mb-3 leading-snug"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                  color: 'var(--roa-text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                이 글의 나머지를<br />멤버에게만 공개해요
              </h3>
              <p
                className="text-sm leading-relaxed mb-7"
                style={{ color: 'var(--roa-text-secondary)' }}
              >
                이메일 하나로 무료 가입.<br />
                모든 아카이브 글과 시리즈를 제한 없이 읽을 수 있어요.
              </p>

              <Link
                href="/membership"
                className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 rounded-full text-sm font-semibold min-h-[48px]"
                style={{ backgroundColor: 'var(--roa-gold)', color: '#0A0A0A' }}
              >
                무료로 멤버 가입하기
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>

              <p
                className="mt-3 text-xs"
                style={{ color: 'var(--roa-text-tertiary)' }}
              >
                신용카드 불필요 · 언제든 탈퇴 가능
              </p>
            </div>
          </m.div>
        </>
      )}
    </div>
  );
}
