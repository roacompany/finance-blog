/**
 * ROA Finance — Typography Tokens
 *
 * Serif   → 제목, 디스플레이 (에디토리얼 무게감)
 * Sans    → 본문, UI (가독성)
 * Mono    → 숫자, 코드 (정확성)
 *
 * Korean: Noto Serif KR (serif) / Pretendard (sans)
 * Latin:  Playfair Display (serif) / Inter (sans)
 */

export const typography = {
  // ─── Font Families ────────────────────────────────────
  font: {
    serif: '"Playfair Display", "Noto Serif KR", Georgia, serif',
    sans:  '"Pretendard", "Inter", -apple-system, sans-serif',
    mono:  '"JetBrains Mono", "Fira Code", monospace',
  },

  // ─── Font Sizes ───────────────────────────────────────
  size: {
    '2xs': '0.625rem',  // 10px
    xs:    '0.75rem',   // 12px
    sm:    '0.875rem',  // 14px
    base:  '1rem',      // 16px
    lg:    '1.125rem',  // 18px
    xl:    '1.25rem',   // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },

  // ─── Line Heights ─────────────────────────────────────
  leading: {
    none:    '1',
    tight:   '1.2',
    snug:    '1.35',
    normal:  '1.5',
    relaxed: '1.65',
    loose:   '1.8',
    article: '1.9',   // 긴 본문 최적 가독성
  },

  // ─── Font Weights ─────────────────────────────────────
  weight: {
    light:    '300',
    regular:  '400',
    medium:   '500',
    semibold: '600',
    bold:     '700',
    black:    '900',
  },

  // ─── Letter Spacing ───────────────────────────────────
  tracking: {
    tighter: '-0.04em',
    tight:   '-0.02em',
    normal:  '0em',
    wide:    '0.04em',
    wider:   '0.08em',
    widest:  '0.16em',
  },

  // ─── Semantic Roles ───────────────────────────────────
  role: {
    display: {
      fontFamily: '"Playfair Display", "Noto Serif KR", serif',
      fontSize:   '4.5rem',
      fontWeight: '700',
      lineHeight: '1.1',
      letterSpacing: '-0.03em',
    },
    heading1: {
      fontFamily: '"Playfair Display", "Noto Serif KR", serif',
      fontSize:   '2.5rem',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
    },
    heading2: {
      fontFamily: '"Playfair Display", "Noto Serif KR", serif',
      fontSize:   '1.75rem',
      fontWeight: '600',
      lineHeight: '1.3',
    },
    heading3: {
      fontFamily: '"Pretendard", "Inter", sans-serif',
      fontSize:   '1.25rem',
      fontWeight: '600',
      lineHeight: '1.4',
    },
    body: {
      fontFamily: '"Pretendard", "Inter", sans-serif',
      fontSize:   '1.0625rem',
      fontWeight: '400',
      lineHeight: '1.9',
    },
    bodyLarge: {
      fontFamily: '"Pretendard", "Inter", sans-serif',
      fontSize:   '1.125rem',
      fontWeight: '400',
      lineHeight: '1.8',
    },
    caption: {
      fontFamily: '"Pretendard", "Inter", sans-serif',
      fontSize:   '0.8125rem',
      fontWeight: '400',
      lineHeight: '1.5',
    },
    label: {
      fontFamily: '"Pretendard", "Inter", sans-serif',
      fontSize:   '0.75rem',
      fontWeight: '500',
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
    },
  },
} as const;

export type TypographyToken = typeof typography;
