export type Theme = 'dark' | 'light';

export const THEME_KEY = 'roa-theme';
export const DEFAULT_THEME: Theme = 'dark';

export function getTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

export function toggleTheme(): Theme {
  const current = document.documentElement.getAttribute('data-theme') as Theme ?? DEFAULT_THEME;
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

// FOUC 방지용 인라인 스크립트 (layout.tsx의 <head>에 삽입)
export const THEME_SCRIPT = `
(function(){
  try {
    var t = localStorage.getItem('roa-theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
  } catch(e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;
