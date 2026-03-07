'use client';

import Link from 'next/link';
import { m } from 'framer-motion';
import type { Article } from '@/lib/mock-data';
import type { ArticleGridConfig } from '@/lib/component-registry';

const TYPE_LABEL: Record<Article['type'], string> = {
  'letter':     'Letter',
  'deep-dive':  'Deep Dive',
  'series-hub': 'Series',
};

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const [from, to] = article.thumbnailGradient;
  const num = String(index + 1).padStart(2, '0');

  return (
    <m.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.09, ease: EASE }}
    >
      <Link href={`/posts/${article.slug}`} className="group block">
        <article className="flex flex-col">

          {/* Thumbnail */}
          <div
            className="relative rounded-xl overflow-hidden mb-4"
            style={{ aspectRatio: '16/10' }}
          >
            <div
              className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]"
              style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at 25% 25%, rgba(232,213,176,0.11) 0%, transparent 65%)',
              }}
            />
            {!article.isToday && (
              <div
                className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.55)',
                  color: 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <svg width="8" height="9" viewBox="0 0 8 9" fill="none" aria-hidden>
                  <rect x="1" y="4" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1"/>
                  <path d="M2.5 4V3a1.5 1.5 0 0 1 3 0v1" stroke="currentColor" strokeWidth="1"/>
                </svg>
                멤버
              </div>
            )}
          </div>

          {/* Card body */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span
                className="font-mono font-bold tabular-nums"
                style={{ fontSize: '0.75rem', color: 'var(--roa-gold)', letterSpacing: '0.04em' }}
              >{num}</span>
              <span
                className="text-[9px] tracking-[0.14em] uppercase font-medium"
                style={{ color: 'var(--roa-text-tertiary)' }}
              >
                {TYPE_LABEL[article.type]}
              </span>
            </div>

            <h3
              className="font-bold leading-snug mb-2.5 transition-colors duration-200 group-hover:opacity-80"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1rem',
                color: 'var(--roa-text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              {article.title}
            </h3>

            <p
              className="text-sm leading-relaxed line-clamp-2 mb-3"
              style={{ color: 'var(--roa-text-secondary)', fontSize: '0.875rem' }}
            >
              {article.preview}
            </p>

            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--roa-text-tertiary)' }}>
              {article.series && (
                <>
                  <span>{article.series}</span>
                  <span style={{ opacity: 0.35 }}>·</span>
                </>
              )}
              <span>{article.readingTime}분</span>
            </div>
          </div>
        </article>
      </Link>
    </m.div>
  );
}

export function ArticleGrid({ articles, config }: { articles: Article[]; config?: ArticleGridConfig }) {
  const title   = config?.title ?? '아카이브';
  const limit   = config?.limit ?? 9;
  const visible = articles.slice(0, limit);

  return (
    <section
      className="py-16 section-divider"
      style={{ backgroundColor: 'var(--roa-bg-base)' }}
    >
      <div className="mx-auto px-5" style={{ maxWidth: 'var(--roa-container)' }}>

        {/* Section header */}
        <m.div
          className="flex items-center justify-between mb-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="flex items-center gap-3">
            <h2
              className="text-xs tracking-[0.16em] uppercase font-semibold"
              style={{ color: 'var(--roa-text-tertiary)' }}
            >
              {title}
            </h2>
            <div
              className="h-px flex-1 hidden sm:block"
              style={{ width: '40px', backgroundColor: 'var(--roa-border)' }}
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--roa-text-tertiary)' }}>
            <svg width="10" height="11" viewBox="0 0 10 11" fill="none" aria-hidden>
              <rect x="1.5" y="5" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1"/>
              <path d="M3 5V4a2 2 0 0 1 4 0v1" stroke="currentColor" strokeWidth="1"/>
            </svg>
            멤버만 전체 열람
          </div>
        </m.div>

        {/* Grid */}
        {visible.length === 0 ? (
          <p className="py-24 text-center text-sm" style={{ color: 'var(--roa-text-tertiary)' }}>
            아직 글이 없어요.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-12">
            {visible.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        )}

        {articles.length > limit && (
          <div className="mt-12 text-center">
            <button
              className="inline-flex items-center gap-2 text-sm px-6 py-2.5 rounded-full transition-all duration-200"
              style={{ border: '1px solid var(--roa-border)', color: 'var(--roa-text-secondary)' }}
            >
              더 보기
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                <path d="M6.5 3v7M3 9.5l3.5 3.5L10 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
