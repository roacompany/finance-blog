'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

const NAV_LINKS = [
  { href: '/',          label: '오늘의 글' },
  { href: '/series',    label: '시리즈' },
  { href: '/archive',   label: '아카이브' },
  { href: '/about',     label: '소개' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 모바일 메뉴 열릴 때 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-350"
        style={{
          backgroundColor: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--roa-border-subtle)' : '1px solid transparent',
        }}
      >
        <nav
          className="mx-auto flex items-center justify-between h-16 px-5"
          style={{ maxWidth: 'var(--roa-container)' }}
        >
          {/* ─── Logo ─── */}
          <Link
            href="/"
            className="flex items-baseline gap-2 group"
            onClick={() => setMobileOpen(false)}
          >
            <span
              className="text-2xl font-bold tracking-tight transition-colors duration-220"
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--roa-gold)',
              }}
            >
              ROA
            </span>
            <span
              className="hidden sm:block text-[10px] tracking-[0.2em] uppercase transition-colors duration-220"
              style={{ color: 'var(--roa-text-tertiary)' }}
            >
              Finance
            </span>
          </Link>

          {/* ─── Desktop Nav ─── */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm transition-colors duration-220"
                style={{ color: 'var(--roa-text-secondary)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--roa-text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--roa-text-secondary)')}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ─── CTA + Hamburger ─── */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/membership"
              className="hidden md:inline-flex items-center px-4 py-1.5 text-sm rounded-full transition-all duration-220"
              style={{
                border: '1px solid var(--roa-gold)',
                color: 'var(--roa-gold)',
                fontWeight: 500,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--roa-gold)';
                (e.currentTarget as HTMLElement).style.color = '#0A0A0A';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--roa-gold)';
              }}
            >
              멤버 가입
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg transition-colors duration-220"
              aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={mobileOpen}
            >
              <span
                className="block w-5 h-px transition-all duration-220"
                style={{
                  backgroundColor: 'var(--roa-text-secondary)',
                  transform: mobileOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
                }}
              />
              <span
                className="block w-5 h-px transition-all duration-220"
                style={{
                  backgroundColor: 'var(--roa-text-secondary)',
                  opacity: mobileOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-5 h-px transition-all duration-220"
                style={{
                  backgroundColor: 'var(--roa-text-secondary)',
                  transform: mobileOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
                }}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* ─── Mobile Menu ─── */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-350"
        style={{
          backgroundColor: 'rgba(10,10,10,0.98)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          backdropFilter: 'blur(16px)',
        }}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8">
          {NAV_LINKS.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="text-3xl font-serif transition-colors duration-220"
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--roa-text-secondary)',
                transitionDelay: mobileOpen ? `${i * 60}ms` : '0ms',
                transform: mobileOpen ? 'translateY(0)' : 'translateY(12px)',
                opacity: mobileOpen ? 1 : 0,
                transitionProperty: 'color, transform, opacity',
                transitionDuration: '0.2s, 0.35s, 0.35s',
                transitionTimingFunction: 'ease, ease, ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--roa-text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--roa-text-secondary)')}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/membership"
            onClick={() => setMobileOpen(false)}
            className="mt-4 px-8 py-3 text-base rounded-full transition-all duration-220"
            style={{
              border: '1px solid var(--roa-gold)',
              color: 'var(--roa-gold)',
              fontWeight: 500,
              transitionDelay: mobileOpen ? `${NAV_LINKS.length * 60}ms` : '0ms',
              opacity: mobileOpen ? 1 : 0,
            }}
          >
            멤버 가입
          </Link>
        </nav>
      </div>
    </>
  );
}
