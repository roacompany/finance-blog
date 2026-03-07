'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import type { Article } from '@/lib/mock-data';
import type { HeroTodayConfig } from '@/lib/component-registry';

/* ─── helpers ─── */
function formatDateKR(iso: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long', day: 'numeric', timeZone: 'Asia/Seoul',
  }).format(new Date(iso));
}

function pad(n: number) { return String(n).padStart(2, '0'); }

/** 항상 Asia/Seoul 기준 자정까지의 ms — 해외 접속자도 정확 */
function getMidnightMs(): number {
  const now = new Date();
  // 'sv-SE' locale → "YYYY-MM-DD" format (ISO date)
  const seoulDate = now.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
  // 다음 자정 = 오늘 날짜 기준 +1일 00:00:00 KST(+09:00)
  const midnight = new Date(`${seoulDate}T00:00:00+09:00`);
  midnight.setDate(midnight.getDate() + 1);
  return Math.max(0, midnight.getTime() - now.getTime());
}

/* ─── Countdown ─── */
function HeroCountdown() {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    setMs(getMidnightMs());
    const id = setInterval(() => {
      const r = getMidnightMs();
      setMs(r);
      if (r <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // ms === null: 서버 skeleton — hydration 완료 전 DOM 일치 보장
  // urgency는 null일 때 항상 false → 첫 렌더 텍스트 고정
  const urgency    = ms !== null && ms < 3 * 3600 * 1000;
  const numColor   = urgency ? 'var(--roa-gold)' : '#FFFFFF';
  const sepColor   = urgency ? 'var(--roa-gold)' : 'rgba(255,255,255,0.28)';
  const labelColor = urgency ? 'var(--roa-gold)' : 'rgba(255,255,255,0.6)';
  const opacity    = ms === null ? 0.18 : 1;

  const digits = ms === null
    ? [{ v: '--', u: '시간' }, { v: '--', u: '분' }, { v: '--', u: '초' }]
    : (() => {
        const t = Math.floor(ms / 1000);
        return [
          { v: pad(Math.floor(t / 3600)), u: '시간' },
          { v: pad(Math.floor((t % 3600) / 60)), u: '분' },
          { v: pad(t % 60), u: '초' },
        ];
      })();

  return (
    <div style={{ opacity }}>
      {/* 상태 라벨 */}
      <p
        className="text-[10px] tracking-[0.22em] uppercase font-medium mb-3"
        style={{
          color: urgency ? 'var(--roa-gold)' : 'rgba(255,255,255,0.65)',
          textShadow: '0 1px 6px rgba(0,0,0,0.8)',
        }}
      >
        {urgency ? '곧 아카이브로 이동해요' : '자정까지 무료'}
      </p>

      {/* 숫자 블록 — clamp 상한을 5rem으로 낮춰 tablet 오버플로우 방지 */}
      <div className="flex items-end gap-1 sm:gap-2 overflow-hidden">
        {digits.map(({ v, u }, i) => (
          <div key={i} className="flex items-end gap-0.5 sm:gap-1 shrink-0">
            <div className="flex flex-col items-center">
              <span
                className="font-mono font-black tabular-nums leading-none transition-colors duration-500"
                style={{
                  /* 375px → 63.75px, 768px → 80px(cap), 1280px → 80px(cap) */
                  fontSize: 'clamp(3.25rem, 17vw, 5rem)',
                  letterSpacing: '-0.06em',
                  color: numColor,
                  lineHeight: 0.88,
                  textShadow: '0 2px 16px rgba(0,0,0,0.7)',
                }}
              >{v}</span>
              {/* 단위 — floor 0.625rem(10px) 보장 */}
              <span
                className="tracking-[0.18em] uppercase mt-1.5 font-medium"
                style={{
                  fontSize: 'clamp(0.625rem, 2.5vw, 0.75rem)',
                  color: labelColor,
                  textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                }}
              >{u}</span>
            </div>
            {/* 콜론 구분자 */}
            {i < 2 && (
              <span
                className="font-mono font-black select-none shrink-0"
                style={{
                  fontSize: 'clamp(2rem, 11vw, 3.25rem)',
                  color: sepColor,
                  marginBottom: 'clamp(1.125rem, 5vw, 2rem)',
                  lineHeight: 1,
                }}
              >:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main ─── */
interface Props {
  article: Article;
  config?: HeroTodayConfig;
}

export function HeroArticle({ article, config }: Props) {
  const badgeText     = config?.badgeText     ?? '오늘의 노트';
  const showCountdown = config?.showCountdown ?? true;
  const ctaText       = config?.ctaText       ?? '전문 읽기';

  const TEXT_SHADOW = '0 1px 8px rgba(0,0,0,0.85)';

  return (
    <section
      className="relative min-h-svh flex flex-col justify-end overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* ── 이미지 — 풀 배경 ── */}
      <Image
        src="/hero-today.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden
      />

      {/* ── 오버레이 레이어 ── */}
      {/* Layer 1: 전체 균일 어둠 (밝은 사진 영역 눌러줌) */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(10,10,10,0.5)' }} />
      {/* Layer 2: 상단→하단 그라디언트 — 하단 콘텐츠 완전 보호 */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'linear-gradient(to top,',
            '  #0A0A0A 0%,',
            '  rgba(10,10,10,0.96) 25%,',
            '  rgba(10,10,10,0.75) 50%,',
            '  rgba(10,10,10,0.35) 75%,',
            '  rgba(10,10,10,0.15) 100%',
            ')',
          ].join(' '),
        }}
      />
      {/* Layer 3 (md+): 좌측 추가 어둠 — 데스크톱 텍스트 구역 */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background: 'linear-gradient(to right, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.35) 50%, transparent 70%)',
        }}
      />

      {/* ── 콘텐츠 — 하단 앵커 ── */}
      <m.div
        className="relative z-10 px-5 pt-36 md:max-w-[60%] lg:max-w-[54%]"
        style={{
          paddingLeft: 'max(1.25rem, calc((100vw - 1020px) / 2 + 1.25rem))',
          paddingRight: 'clamp(1.25rem, 4vw, 3rem)',
          paddingBottom: 'max(3.5rem, calc(3.5rem + env(safe-area-inset-bottom)))',
        }}
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
        }}
      >
        {/* Badge + 시리즈 */}
        <m.div
          className="flex items-center gap-2.5 mb-7"
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } } }}
        >
          <span
            className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-semibold px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: 'rgba(10,10,10,0.55)',
              color: 'var(--roa-gold)',
              border: '1px solid rgba(232,213,176,0.35)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              textShadow: TEXT_SHADOW,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--roa-gold)' }} />
            {badgeText}
          </span>
          {article.series && (
            <span
              className="text-xs font-medium"
              style={{ color: 'rgba(255,255,255,0.75)', textShadow: TEXT_SHADOW }}
            >
              {article.series}
            </span>
          )}
        </m.div>

        {/* 카운트다운 */}
        {showCountdown && (
          <m.div
            className="mb-8"
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } } }}
          >
            <HeroCountdown />
          </m.div>
        )}

        {/* 제목 */}
        <m.h1
          id="hero-title"
          className="font-bold leading-[1.15] mb-4"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.875rem, 7vw, 2.75rem)',
            letterSpacing: '-0.025em',
            color: '#FFFFFF',
            textShadow: '0 2px 16px rgba(0,0,0,0.8)',
          }}
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] } } }}
        >
          {article.title}
        </m.h1>

        {/* 부제 */}
        <m.p
          className="mb-8 leading-relaxed"
          style={{
            fontSize: 'clamp(0.9375rem, 2.8vw, 1.0625rem)',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: '440px',
            textShadow: TEXT_SHADOW,
          }}
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] } } }}
        >
          {article.subtitle}
        </m.p>

        {/* CTA 영역 */}
        <m.div
          className="flex flex-wrap items-center gap-4"
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } } }}
        >
          {/* 버튼 — min-h 48px (터치 타겟 44px 초과 보장) */}
          <Link
            href={`/posts/${article.slug}`}
            aria-label={`${ctaText}: ${article.title}`}
            className="inline-flex items-center gap-2.5 px-7 rounded-full text-sm font-semibold min-h-[48px]"
            style={{ backgroundColor: 'var(--roa-gold)', color: '#0A0A0A' }}
          >
            {ctaText}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <span
            className="text-xs flex items-center gap-1.5"
            style={{ color: 'rgba(255,255,255,0.65)', textShadow: TEXT_SHADOW }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1"/>
              <path d="M6 3v3.5l2 1.2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            {article.readingTime}분 · {formatDateKR(article.publishedAt)}
          </span>
        </m.div>
      </m.div>
    </section>
  );
}
