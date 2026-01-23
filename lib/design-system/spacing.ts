/**
 * ROA Finance Blog - Spacing System
 * 토스 스타일 여백 체계
 */

export const spacing = {
  // Container
  container: {
    maxWidth: '1200px',
    padding: {
      mobile: '16px',
      tablet: '24px',
      desktop: '32px',
    },
    // Tailwind classes
    className: 'max-w-7xl mx-auto px-4 md:px-6 lg:px-8',
  },

  // Section
  section: {
    vertical: {
      mobile: '32px',
      tablet: '48px',
      desktop: '64px',
    },
    // Tailwind classes
    className: 'py-8 md:py-12 lg:py-16',
  },

  // Card
  card: {
    padding: {
      small: '16px',
      medium: '24px',
      large: '32px',
    },
    gap: {
      small: '12px',
      medium: '16px',
      large: '24px',
    },
    // Tailwind classes
    paddingClass: {
      small: 'p-4',
      medium: 'p-6',
      large: 'p-8',
    },
  },

  // Gap (Grid/Flex)
  gap: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },

  // Margin
  margin: {
    element: '24px',      // 요소 간 기본 간격
    section: '48px',      // 섹션 간 간격
    component: '32px',    // 컴포넌트 간 간격
  },

  // Border Radius
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },

  // Touch Target (접근성)
  touchTarget: {
    minimum: '44px',      // iOS/Android 최소 터치 영역
  },
} as const;

// Responsive container helper
export function getContainerClass(tight = false): string {
  return tight
    ? 'max-w-4xl mx-auto px-4 md:px-6'
    : 'max-w-7xl mx-auto px-4 md:px-6 lg:px-8';
}

// Grid gap helper
export function getGridGap(size: 'sm' | 'md' | 'lg' = 'md'): string {
  const gapMap = {
    sm: 'gap-3',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 md:gap-8',
  };
  return gapMap[size];
}
