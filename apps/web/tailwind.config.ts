import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ROA Design Tokens — CSS 변수 연동
        roa: {
          bg:     'var(--roa-bg-base)',
          elevated: 'var(--roa-bg-elevated)',
          overlay: 'var(--roa-bg-overlay)',
          subtle:  'var(--roa-bg-subtle)',
          primary:   'var(--roa-text-primary)',
          secondary: 'var(--roa-text-secondary)',
          tertiary:  'var(--roa-text-tertiary)',
          accent:    'var(--roa-text-accent)',
          border:    'var(--roa-border)',
          'border-subtle': 'var(--roa-border-subtle)',
          'border-strong': 'var(--roa-border-strong)',
          gold:       'var(--roa-gold)',
          'gold-hover': 'var(--roa-gold-hover)',
          'gold-muted': 'var(--roa-gold-muted)',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Noto Serif KR', 'Georgia', 'serif'],
        sans:  ['var(--font-sans)', 'Pretendard', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['4.5rem',  { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'heading1': ['2.5rem', { lineHeight: '1.2',  letterSpacing: '-0.02em' }],
        'heading2': ['1.75rem',{ lineHeight: '1.3',  letterSpacing: '-0.01em' }],
        'heading3': ['1.25rem',{ lineHeight: '1.4' }],
        'body-lg':  ['1.125rem',{ lineHeight: '1.8' }],
        'body':     ['1.0625rem',{ lineHeight: '1.9' }],
        'caption':  ['0.8125rem',{ lineHeight: '1.5' }],
        'label':    ['0.75rem', { lineHeight: '1', letterSpacing: '0.08em' }],
      },
      maxWidth: {
        'container': '1200px',
        'article':   '720px',
        'hero':      '960px',
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring':    'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '120': '120ms',
        '220': '220ms',
        '350': '350ms',
        '400': '400ms',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.35s ease forwards',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
