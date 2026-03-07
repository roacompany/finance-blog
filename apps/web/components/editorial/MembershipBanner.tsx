'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { MembershipBannerConfig } from '@/lib/component-registry';

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

export function MembershipBanner({ config }: { config?: MembershipBannerConfig }) {
  const headline = config?.headline ?? '지나간 글은 멤버만 읽을 수 있어요';
  const subtext  = config?.subtext  ?? '이메일 하나로 무료 가입. 모든 아카이브 글, 시리즈 전체를 열람하세요.';
  const ctaText  = config?.ctaText  ?? '무료로 멤버 가입하기';

  return (
    <section className="px-5 pb-32">
      <motion.div
        className="mx-auto rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
        style={{ maxWidth: 'var(--roa-container)', backgroundColor: 'var(--roa-bg-elevated)', border: '1px solid var(--roa-border-subtle)' }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65, ease: EASE }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(232,213,176,0.06) 0%, transparent 70%)' }} />

        <motion.p
          className="text-xs tracking-[0.18em] uppercase font-medium mb-6"
          style={{ color: 'var(--roa-gold)' }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        >
          ROA Membership
        </motion.p>

        <motion.h2
          className="font-bold mb-5 leading-tight"
          style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.02em', color: 'var(--roa-text-primary)' }}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
        >
          {headline}
        </motion.h2>

        <motion.p
          className="mb-10 mx-auto text-base leading-relaxed"
          style={{ color: 'var(--roa-text-secondary)', maxWidth: '480px' }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.26, ease: EASE }}
        >
          {subtext}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.34, ease: EASE }}
        >
          <Link
            href="/membership"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold transition-opacity duration-200 hover:opacity-90 min-h-[48px]"
            style={{ backgroundColor: 'var(--roa-gold)', color: '#0A0A0A' }}
          >
            {ctaText}
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
              <path d="M3 7.5h9M8 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <p className="text-xs" style={{ color: 'var(--roa-text-tertiary)' }}>신용카드 불필요 · 이메일만으로 가입</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
