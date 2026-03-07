'use client';

import { useState, useEffect } from 'react';

export function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setPct(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    /*
     * z-[51]: Header(z-50) 위에 올라가는 얇은 gold 라인
     * height 2px: 헤더 레이아웃을 건드리지 않음
     */
    <div
      className="fixed top-0 left-0 right-0 z-[51] pointer-events-none"
      style={{ height: '2px' }}
      aria-hidden
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'var(--roa-gold)',
          transform: `scaleX(${pct / 100})`,
          transformOrigin: 'left center',
          transition: 'transform 80ms linear',
        }}
      />
    </div>
  );
}
