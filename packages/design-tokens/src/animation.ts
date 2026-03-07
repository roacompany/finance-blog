/**
 * ROA Finance — Animation Tokens
 * 절제된 움직임. 있어야 할 곳에만.
 */

export const animation = {
  // ─── Duration ─────────────────────────────────────────
  duration: {
    instant:  '0ms',
    fast:     '120ms',
    normal:   '220ms',
    slow:     '350ms',
    slower:   '500ms',
    page:     '400ms',    // 페이지 전환
  },

  // ─── Easing ───────────────────────────────────────────
  easing: {
    // 표준
    linear:    'linear',
    ease:      'ease',
    easeIn:    'cubic-bezier(0.4, 0, 1, 1)',
    easeOut:   'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // 에디토리얼
    editorial: 'cubic-bezier(0.16, 1, 0.3, 1)',   // 스무스하게 감속
    spring:    'cubic-bezier(0.34, 1.56, 0.64, 1)', // 살짝 튐
    entrance:  'cubic-bezier(0, 0, 0.2, 1)',        // 요소 등장
  },

  // ─── Framer Motion Variants (Web) ─────────────────────
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
    },
    slideUp: {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    },
    slideDown: {
      initial: { opacity: 0, y: -12 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
    },
    stagger: {
      animate: { transition: { staggerChildren: 0.07 } },
    },
  },
} as const;

export type AnimationToken = typeof animation;
