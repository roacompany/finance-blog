'use client';

import Link from 'next/link';
import type { SeriesCarouselConfig } from '@/lib/component-registry';

interface Series { id: string; label: string; count: number; }

const SERIES_COLORS = [
  { bg: 'rgba(232,213,176,0.07)', border: 'rgba(232,213,176,0.15)', dot: '#E8D5B0' },
  { bg: 'rgba(99,179,237,0.07)',  border: 'rgba(99,179,237,0.15)',  dot: '#63B3ED' },
  { bg: 'rgba(104,211,145,0.07)', border: 'rgba(104,211,145,0.15)', dot: '#68D391' },
  { bg: 'rgba(246,173,85,0.07)',  border: 'rgba(246,173,85,0.15)',  dot: '#F6AD55' },
  { bg: 'rgba(183,148,246,0.07)', border: 'rgba(183,148,246,0.15)', dot: '#B794F6' },
];

export function SeriesCarousel({ series, config }: { series: Series[]; config?: SeriesCarouselConfig }) {
  const title = config?.title ?? '시리즈로 읽기';

  return (
    <section
      className="py-12 mb-4 section-divider"
      style={{ backgroundColor: 'var(--roa-bg-elevated)' }}
    >
      <div className="mx-auto px-5 mb-6 flex items-center justify-between" style={{ maxWidth: 'var(--roa-container)' }}>
        <h2 className="text-xs tracking-[0.14em] uppercase font-medium" style={{ color: 'var(--roa-text-tertiary)' }}>
          {title}
        </h2>
        <Link href="/" className="roa-link text-xs">전체 보기 →</Link>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pl-6 pr-6 pb-1">
        {series.map((s, i) => {
          const color = SERIES_COLORS[i % SERIES_COLORS.length];
          return (
            <Link key={s.id} href={s.count > 0 ? `/?series=${encodeURIComponent(s.id)}` : '#'} className="shrink-0 group">
              <div
                className="relative w-52 h-32 rounded-2xl flex flex-col justify-end p-5 overflow-hidden transition-all duration-350"
                style={{
                  backgroundColor: s.count > 0 ? color.bg : 'var(--roa-bg-subtle)',
                  border: `1px solid ${s.count > 0 ? color.border : 'var(--roa-border-subtle)'}`,
                  opacity: s.count === 0 ? 0.45 : 1,
                }}
              >
                {/* 시리즈 색상 dot */}
                <div
                  className="absolute top-4 right-4 w-2 h-2 rounded-full"
                  style={{ backgroundColor: s.count > 0 ? color.dot : 'var(--roa-text-tertiary)' }}
                />
                <p className="text-[10px] tracking-[0.1em] uppercase mb-1.5" style={{ color: 'var(--roa-text-tertiary)' }}>
                  {s.count > 0 ? `${s.count}편` : '준비 중'}
                </p>
                <p
                  className="text-sm font-semibold leading-snug"
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--roa-text-primary)' }}
                >
                  {s.label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
