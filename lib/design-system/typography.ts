/**
 * ROA Finance Blog - Typography System
 * 토스 스타일 타이포그래피 체계
 */

export const typography = {
  // Font Families
  fontFamily: {
    pretendard: ['Pretendard Variable', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
    mono: ['"SF Mono"', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
  },

  // Headings
  heading: {
    h1: {
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
      color: '#191F28',
    },
    h2: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      color: '#191F28',
    },
    h3: {
      fontSize: '20px',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      color: '#191F28',
    },
    h4: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#191F28',
    },
  },

  // Body Text
  body: {
    large: {
      fontSize: '17px',
      lineHeight: 1.7,
      letterSpacing: '-0.01em',
      color: '#4E5968',
    },
    default: {
      fontSize: '15px',
      lineHeight: 1.6,
      color: '#4E5968',
    },
    small: {
      fontSize: '14px',
      lineHeight: 1.5,
      color: '#6B7684',
    },
  },

  // Caption / Meta
  caption: {
    default: {
      fontSize: '13px',
      lineHeight: 1.4,
      color: '#8B95A1',
    },
    small: {
      fontSize: '12px',
      lineHeight: 1.3,
      color: '#8B95A1',
    },
  },

  // Responsive classes (Tailwind)
  responsive: {
    h1: 'text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight',
    h2: 'text-xl md:text-2xl lg:text-3xl font-bold leading-snug',
    h3: 'text-lg md:text-xl lg:text-2xl font-bold leading-snug',
    body: 'text-base md:text-lg leading-relaxed',
    caption: 'text-sm md:text-base',
  },
} as const;

// Helper function to get heading styles
export function getHeadingStyle(level: 'h1' | 'h2' | 'h3' | 'h4') {
  return typography.heading[level];
}

// Helper function to get body style
export function getBodyStyle(size: 'large' | 'default' | 'small' = 'default') {
  return typography.body[size];
}
