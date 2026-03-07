import Link from 'next/link';

const SERIES_LINKS = [
  { href: '/?series=' + encodeURIComponent('Series 01. 금리·통화정책'), label: '금리·통화정책' },
  { href: '/?series=' + encodeURIComponent('Series 02. 실전 대출 가이드'), label: '실전 대출' },
  { href: '/?series=' + encodeURIComponent('Series 03. 부동산·내집마련'), label: '부동산·내집마련' },
  { href: '/?series=' + encodeURIComponent('Series 04. 절세·투자'), label: '절세·투자' },
];

const SITE_LINKS = [
  { href: '/about',      label: '소개' },
  { href: '/archive',    label: '아카이브' },
  { href: '/membership', label: '멤버십' },
  { href: '/contact',    label: '문의' },
  { href: '/privacy',    label: '개인정보처리방침' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-32" style={{ borderTop: '1px solid var(--roa-border-subtle)' }}>
      <div className="mx-auto px-6 py-16" style={{ maxWidth: 'var(--roa-container)' }}>

        {/* ─── Top ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--roa-gold)' }}
              >
                ROA
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--roa-text-tertiary)' }}>
              금융을 깊이 이해하는 사람들을 위한
              <br />
              인사이트 미디어.
            </p>
            <Link href="/membership" className="roa-link-gold inline-flex items-center gap-2 text-sm">
              멤버 가입하기
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* Series */}
          <div>
            <p className="text-xs tracking-[0.12em] uppercase mb-5 font-medium" style={{ color: 'var(--roa-text-tertiary)' }}>
              시리즈
            </p>
            <ul className="space-y-3">
              {SERIES_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="roa-link text-sm">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Site */}
          <div>
            <p className="text-xs tracking-[0.12em] uppercase mb-5 font-medium" style={{ color: 'var(--roa-text-tertiary)' }}>
              사이트
            </p>
            <ul className="space-y-3">
              {SITE_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="roa-link text-sm">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ─── Bottom ─── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid var(--roa-border-subtle)' }}
        >
          <p className="text-xs" style={{ color: 'var(--roa-text-tertiary)' }}>
            © {year} ROA Finance. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--roa-text-tertiary)' }}>
            본 콘텐츠는 정보 제공 목적이며 투자 권유가 아닙니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
