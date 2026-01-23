/**
 * ROA Finance Blog - Component Styles
 * 토스 스타일 컴포넌트 스타일 정의
 */

export const componentStyles = {
  // Card
  card: {
    base: 'rounded-2xl bg-white border border-gray-200 transition-all duration-300',
    hover: 'hover:-translate-y-2 hover:shadow-xl',
    shadow: {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
    },
    padding: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },

  // Button
  button: {
    base: 'rounded-xl font-semibold transition-all duration-200 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed',
    variants: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
      secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300',
      outline: 'bg-white border-2 border-gray-200 text-gray-800 hover:border-blue-600 hover:bg-blue-50',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
      danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
    },
    sizes: {
      sm: 'px-4 py-2 text-sm min-h-[36px]',
      md: 'px-6 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[52px]',
    },
  },

  // Badge
  badge: {
    base: 'inline-flex items-center rounded-full font-medium',
    sizes: {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-base',
    },
    // 색상은 getBadgeColor 함수에서 동적 처리
  },

  // Input
  input: {
    base: 'w-full rounded-xl border transition-all duration-200 font-medium',
    states: {
      default: 'border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100',
      error: 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100',
      success: 'border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-100',
      disabled: 'bg-gray-100 border-gray-200 cursor-not-allowed',
    },
    sizes: {
      sm: 'px-3 py-2 text-sm min-h-[36px]',
      md: 'px-4 py-3 text-base min-h-[44px]',
      lg: 'px-5 py-4 text-lg min-h-[52px]',
    },
  },

  // Slider
  slider: {
    base: 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
    thumb: 'appearance-none w-5 h-5 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 active:scale-110 transition-transform',
  },

  // Link
  link: {
    base: 'transition-colors duration-200',
    variants: {
      primary: 'text-blue-600 hover:text-blue-700 font-medium',
      subtle: 'text-gray-600 hover:text-gray-900',
      nav: 'text-gray-700 hover:text-blue-600 font-semibold',
    },
  },

  // Divider
  divider: {
    horizontal: 'border-t border-gray-200',
    vertical: 'border-l border-gray-200',
  },

  // Gradient Banner (PostCard용)
  gradientBanner: {
    base: 'h-[180px] relative overflow-hidden',
    overlay: 'absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300',
  },
} as const;

// Helper: Combine classes
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Helper: Get card classes
export function getCardClasses(options?: {
  hover?: boolean;
  shadow?: keyof typeof componentStyles.card.shadow;
  padding?: keyof typeof componentStyles.card.padding;
}): string {
  const { hover = true, shadow = 'none', padding = 'md' } = options || {};

  return cn(
    componentStyles.card.base,
    hover && componentStyles.card.hover,
    componentStyles.card.shadow[shadow],
    componentStyles.card.padding[padding]
  );
}

// Helper: Get button classes
export function getButtonClasses(
  variant: keyof typeof componentStyles.button.variants = 'primary',
  size: keyof typeof componentStyles.button.sizes = 'md'
): string {
  return cn(
    componentStyles.button.base,
    componentStyles.button.variants[variant],
    componentStyles.button.sizes[size]
  );
}

// Helper: Get input classes
export function getInputClasses(
  size: keyof typeof componentStyles.input.sizes = 'md',
  state: keyof typeof componentStyles.input.states = 'default'
): string {
  return cn(
    componentStyles.input.base,
    componentStyles.input.states[state],
    componentStyles.input.sizes[size]
  );
}
