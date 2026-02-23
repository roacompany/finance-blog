/**
 * ROA Finance Blog - Color System
 * 토스 스타일 색상 체계
 */

export const colors = {
  // Background
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F2F4F6',
  },

  // Text
  text: {
    high: '#191F2B',      // 제목, 강조
    body: '#333D4B',      // 본문
    mid: '#8B95A1',       // 날짜, 부가 설명
    low: '#B0B8C1',       // 연한 텍스트
    inverse: '#FFFFFF',   // 다크 배경용
  },

  // Border
  border: {
    light: '#F2F4F6',
    default: '#E5E8EB',
    strong: '#D1D6DB',
  },

  // Brand
  brand: {
    primary: '#3182F6',    // Toss Blue
    hover: '#1B64DA',
    light: '#E8F3FF',
  },

  // Semantic
  semantic: {
    success: '#00C73C',
    warning: '#FFA900',
    error: '#F04452',
    info: '#3182F6',
  },

  // Financial
  financial: {
    rise: '#F04452',       // 상승 (빨강)
    fall: '#3182F6',       // 하락 (파랑)
  },

} as const;

// Badge variant colors
export function getBadgeColor(tag: string): { bg: string; text: string } {
  const colorMap: Record<string, { bg: string; text: string }> = {
    '기초': { bg: '#F3F1FF', text: '#7C3AED' },
    '금리': { bg: '#FFF1F3', text: '#E11D48' },
    '통화정책': { bg: '#E8F3FF', text: '#1B64DA' },
    '대출': { bg: '#ECFDF5', text: '#059669' },
    '투자': { bg: '#FEF3C7', text: '#D97706' },
    '부동산': { bg: '#E0F2FE', text: '#0369A1' },
    '채권': { bg: '#FCE7F3', text: '#BE185D' },
    '주식': { bg: '#FFE4E6', text: '#BE123C' },
    '경제지표': { bg: '#FEF3C7', text: '#CA8A04' },
  };

  return colorMap[tag] || { bg: '#F3F4F6', text: '#4B5563' };
}
