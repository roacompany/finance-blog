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

  // Gradient Tags (기존 태그 색상 유지)
  gradients: {
    기초: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    금리: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    '통화정책': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    대출: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    투자: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    부동산: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    채권: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    주식: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    경제지표: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  },
} as const;

// Gradient helper function
export function getTagGradient(tags: string[]): string {
  if (tags.length === 0) {
    return colors.gradients['기초'];
  }

  const firstTag = tags[0];
  return colors.gradients[firstTag as keyof typeof colors.gradients] || colors.gradients['기초'];
}

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
