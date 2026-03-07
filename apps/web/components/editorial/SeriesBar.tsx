'use client';

import Link from 'next/link';

interface Series {
  id: string;
  label: string;
  count: number;
}

export function SeriesBar({ series }: { series: Series[] }) {
  return (
    <div
      className="sticky top-16 z-30 mx-0 mb-16"
      style={{
        backgroundColor: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--roa-border-subtle)',
      }}
    >
      <div
        className="mx-auto px-6 flex items-center gap-1 overflow-x-auto scrollbar-hide py-3"
        style={{ maxWidth: 'var(--roa-container)' }}
      >
        <Link
          href="/"
          className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-220"
          style={{
            backgroundColor: 'var(--roa-bg-subtle)',
            color: 'var(--roa-text-primary)',
          }}
        >
          전체
        </Link>
        {series.map(s => (
          <Link
            key={s.id}
            href={`/?series=${encodeURIComponent(s.id)}`}
            className="roa-link shrink-0 px-3.5 py-1.5 rounded-full text-xs transition-all duration-220 whitespace-nowrap"
            style={{
              color: s.count === 0 ? 'var(--roa-text-tertiary)' : 'var(--roa-text-secondary)',
              cursor: s.count === 0 ? 'default' : 'pointer',
            }}
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
