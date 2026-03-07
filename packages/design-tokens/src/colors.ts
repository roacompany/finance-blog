/**
 * ROA Finance — Color Tokens
 * Dark editorial aesthetic inspired by longblack.co
 *
 * Web: CSS custom properties (--roa-*)
 * iOS: Swift enum (generated via generate.ts)
 */

export const colors = {
  // ─── Background ───────────────────────────────────────
  background: {
    base:    '#0A0A0A', // 최하단 배경 (near black)
    elevated:'#111111', // 카드, 모달
    overlay: '#1A1A1A', // 드로어, 팝업
    subtle:  '#222222', // hover, 미묘한 강조
  },

  // ─── Text ─────────────────────────────────────────────
  text: {
    primary:   '#F5F5F5', // 본문, 제목
    secondary: '#A0A0A0', // 날짜, 부제목
    tertiary:  '#666666', // 플레이스홀더, 비활성
    inverse:   '#0A0A0A', // 밝은 배경 위 텍스트
    accent:    '#E8D5B0', // 브랜드 강조 (warm gold)
  },

  // ─── Border ───────────────────────────────────────────
  border: {
    default: '#2A2A2A',
    subtle:  '#1E1E1E',
    strong:  '#3A3A3A',
  },

  // ─── Brand ────────────────────────────────────────────
  brand: {
    gold:       '#E8D5B0', // 메인 브랜드 색 (warm gold)
    goldHover:  '#D4BC90',
    goldMuted:  '#3A3020', // 배경에 gold 뉘앙스
    white:      '#F5F5F5',
  },

  // ─── Semantic ─────────────────────────────────────────
  semantic: {
    success: '#4CAF50',
    warning: '#FF9800',
    error:   '#F44336',
    info:    '#2196F3',
  },

  // ─── Paywall ──────────────────────────────────────────
  paywall: {
    blurStart: 'rgba(10, 10, 10, 0)',
    blurEnd:   'rgba(10, 10, 10, 0.96)',
  },
} as const;

export type ColorToken = typeof colors;
