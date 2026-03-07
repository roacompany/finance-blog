'use client';

import { useState, useEffect } from 'react';

function getMidnightRemaining() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(0, midnight.getTime() - now.getTime());
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function Countdown() {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    // 클라이언트에서만 실행 — hydration 완료 후 시작
    setMs(getMidnightRemaining());
    const id = setInterval(() => {
      const r = getMidnightRemaining();
      setMs(r);
      if (r <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // 서버 렌더링 / 클라이언트 첫 paint: 아무것도 렌더하지 않음 → hydration mismatch 원천 차단
  if (ms === null) return (
    <div className="flex items-end gap-2">
      <div className="flex gap-1 items-end">
        {['--', '--', '--'].map((v, i) => (
          <span key={i} className="flex flex-col items-center">
            <span
              className="font-mono font-bold tabular-nums leading-none"
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                color: 'var(--roa-text-primary)',
                opacity: 0.15,
              }}
            >
              {v}
            </span>
            <span className="text-[9px] tracking-[0.12em] uppercase mt-1" style={{ color: 'var(--roa-text-tertiary)', opacity: 0.4 }}>
              {['시', '분', '초'][i]}
            </span>
          </span>
        ))}
      </div>
    </div>
  );

  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const urgency = h < 3;

  const digits = [
    { value: pad(h), unit: '시' },
    { value: pad(m), unit: '분' },
    { value: pad(s), unit: '초' },
  ];

  return (
    <div className="flex flex-col items-start gap-2">
      <p
        className="text-[10px] tracking-[0.16em] uppercase font-medium"
        style={{ color: urgency ? 'var(--roa-gold)' : 'var(--roa-text-tertiary)' }}
      >
        {urgency ? '곧 아카이브로 이동해요' : '오늘 무료로 읽을 수 있어요'}
      </p>

      <div className="flex items-end gap-3">
        {digits.map(({ value, unit }, i) => (
          <div key={unit} className="flex items-end gap-1">
            <div className="flex flex-col items-center">
              <span
                className="font-mono font-bold tabular-nums leading-none transition-colors duration-500"
                style={{
                  fontSize: 'clamp(2.75rem, 9vw, 5rem)',
                  letterSpacing: '-0.04em',
                  color: urgency ? 'var(--roa-gold)' : 'var(--roa-text-primary)',
                }}
              >
                {value}
              </span>
              <span
                className="text-[9px] tracking-[0.14em] uppercase mt-1.5"
                style={{ color: 'var(--roa-text-tertiary)' }}
              >
                {unit}
              </span>
            </div>
            {i < 2 && (
              <span
                className="font-mono font-bold mb-5 leading-none"
                style={{
                  fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                  color: urgency ? 'var(--roa-gold)' : 'var(--roa-text-tertiary)',
                  opacity: 0.4,
                }}
              >
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
