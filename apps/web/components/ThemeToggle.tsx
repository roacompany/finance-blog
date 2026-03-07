'use client';

import { useEffect, useState } from 'react';
import { toggleTheme, getTheme, type Theme } from '@/lib/theme';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getTheme());
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-8 h-8" />; // 레이아웃 안정용 placeholder

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(toggleTheme())}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-220"
      style={{ color: 'var(--roa-text-tertiary)' }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--roa-text-primary)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--roa-text-tertiary)')}
    >
      {isDark ? (
        // 선 아이콘 — 라이트로 전환
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
          <circle cx="8.5" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M8.5 1v1.5M8.5 14.5V16M1 8.5h1.5M14.5 8.5H16M3.2 3.2l1.1 1.1M12.7 12.7l1.1 1.1M12.7 3.2l-1.1 1.1M3.2 12.7l1.1 1.1"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ) : (
        // 달 아이콘 — 다크로 전환
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M14 10.5A6.5 6.5 0 0 1 5.5 2a6.5 6.5 0 1 0 8.5 8.5z"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}
