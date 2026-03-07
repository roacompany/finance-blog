'use client';

import Link from 'next/link';
import { m } from 'framer-motion';

const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const ITEM = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

interface Props {
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
  series?: string;
  isToday: boolean;
  gradFrom: string;
  gradTo: string;
}

function formatDateKR(dateStr: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Seoul',
  }).format(new Date(dateStr));
}

export function ArticleHeader({ title, description, date, readingTime, tags, series, isToday, gradFrom, gradTo }: Props) {
  return (
    <m.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}
    >
      {/* 뒤로가기 */}
      <m.div variants={ITEM}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs mb-8 py-3 transition-colors duration-200 roa-link"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          홈으로
        </Link>
      </m.div>

      {/* 뱃지 행 */}
      <m.div className="flex flex-wrap items-center gap-2.5 mb-5" variants={ITEM}>
        {isToday ? (
          <span
            className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: 'var(--roa-gold-muted)', color: 'var(--roa-gold)', border: '1px solid rgba(232,213,176,0.2)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--roa-gold)' }} />
            오늘의 노트
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: 'var(--roa-bg-elevated)', color: 'var(--roa-text-tertiary)', border: '1px solid var(--roa-border)' }}
          >
            <svg width="9" height="10" viewBox="0 0 9 10" fill="none" aria-hidden>
              <rect x="1" y="4.5" width="7" height="5.5" rx="1" stroke="currentColor" strokeWidth="1"/>
              <path d="M2.5 4.5V3a2 2 0 0 1 4 0v1.5" stroke="currentColor" strokeWidth="1"/>
            </svg>
            아카이브
          </span>
        )}
        {series && (
          <span className="text-xs" style={{ color: 'var(--roa-text-tertiary)' }}>
            {series}
          </span>
        )}
      </m.div>

      {/* 제목 */}
      <m.h1
        className="font-bold leading-[1.2] mb-4"
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.75rem, 6vw, 2.75rem)',
          letterSpacing: '-0.025em',
          color: 'var(--roa-text-primary)',
        }}
        variants={ITEM}
      >
        {title}
      </m.h1>

      {/* 부제 */}
      <m.p
        className="mb-6 leading-relaxed"
        style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', color: 'var(--roa-text-secondary)' }}
        variants={ITEM}
      >
        {description}
      </m.p>

      {/* 메타 */}
      <m.div
        className="flex flex-wrap items-center gap-3 text-xs"
        style={{ color: 'var(--roa-text-tertiary)' }}
        variants={ITEM}
      >
        <time dateTime={date}>{formatDateKR(date)}</time>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>{readingTime} 읽기</span>
        {tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-full text-[11px]"
            style={{ backgroundColor: 'var(--roa-bg-elevated)', color: 'var(--roa-text-tertiary)', border: '1px solid var(--roa-border-subtle)' }}
          >
            {tag}
          </span>
        ))}
      </m.div>

      {/* 썸네일 */}
      <m.div
        className="relative mt-8 rounded-2xl overflow-hidden"
        style={{ aspectRatio: '16/9' }}
        variants={{ hidden: { opacity: 0, scale: 0.98 }, show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } } }}
      >
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${gradFrom} 0%, ${gradTo} 100%)` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(232,213,176,0.11) 0%, transparent 65%)' }}
        />
      </m.div>
    </m.div>
  );
}
