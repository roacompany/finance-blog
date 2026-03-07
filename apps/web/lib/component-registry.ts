/**
 * ROA Finance — Component Registry
 *
 * 모든 UI 컴포넌트를 여기에 등록한다.
 * Admin 페이지 빌더는 이 레지스트리를 기반으로 동작한다.
 * Supabase page_components 테이블의 component_key와 1:1 대응.
 */

// ─── Component Config Types ───────────────────────────────

export interface HeroTodayConfig {
  badgeText: string;          // e.g. "오늘의 글"
  showCountdown: boolean;     // 자정 카운트다운 표시 여부
  ctaText: string;            // e.g. "전문 읽기"
}

export interface SeriesCarouselConfig {
  title: string;              // e.g. "시리즈로 읽기"
  seriesIds: string[];        // 표시할 시리즈 ID 목록
  showAll: boolean;
}

export interface PromoBannerConfig {
  text: string;               // e.g. "오늘 가입하면 전체 아카이브 무료"
  ctaText: string;
  ctaLink: string;
  bgColor: string;            // e.g. "#E8D5B0"
  textColor: string;
  enabled: boolean;
}

export interface MembershipBannerConfig {
  headline: string;
  subtext: string;
  ctaText: string;
  showBenefits: boolean;
}

export interface ArticleGridConfig {
  title: string;              // 섹션 제목 e.g. "아카이브"
  limit: number;              // 표시 개수
  filterBySeriesId?: string;  // 특정 시리즈만
}

export interface SectionDividerConfig {
  style: 'line' | 'space' | 'gradient';
}

// ─── Union Config Type ────────────────────────────────────

export type ComponentConfig =
  | HeroTodayConfig
  | SeriesCarouselConfig
  | PromoBannerConfig
  | MembershipBannerConfig
  | ArticleGridConfig
  | SectionDividerConfig;

// ─── Registry Entry ───────────────────────────────────────

export interface ComponentMeta {
  key: string;
  label: string;              // Admin에서 보이는 이름
  description: string;
  defaultConfig: ComponentConfig;
  configSchema: ComponentConfigField[];  // Admin 편집 폼 스키마
}

export interface ComponentConfigField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'boolean' | 'color' | 'number' | 'select' | 'link';
  options?: { value: string; label: string }[];  // select 전용
  placeholder?: string;
}

// ─── Registry ─────────────────────────────────────────────

export const COMPONENT_REGISTRY: ComponentMeta[] = [
  {
    key: 'hero-today',
    label: 'Today Hero',
    description: '오늘의 글을 강조하는 전면 히어로. 자정 카운트다운 포함.',
    defaultConfig: {
      badgeText: '오늘의 글',
      showCountdown: true,
      ctaText: '전문 읽기',
    } as HeroTodayConfig,
    configSchema: [
      { key: 'badgeText',     label: '배지 텍스트',   type: 'text', placeholder: '오늘의 글' },
      { key: 'showCountdown', label: '카운트다운 표시', type: 'boolean' },
      { key: 'ctaText',       label: 'CTA 버튼 텍스트', type: 'text', placeholder: '전문 읽기' },
    ],
  },
  {
    key: 'promo-banner',
    label: '프로모션 배너',
    description: '상단 얇은 프로모션 배너. 멤버십 유도 등 공지에 사용.',
    defaultConfig: {
      text: '오늘 가입하면 전체 아카이브를 무료로 열람할 수 있어요',
      ctaText: '무료 가입',
      ctaLink: '/membership',
      bgColor: '#E8D5B0',
      textColor: '#0A0A0A',
      enabled: true,
    } as PromoBannerConfig,
    configSchema: [
      { key: 'text',      label: '배너 텍스트', type: 'textarea' },
      { key: 'ctaText',   label: 'CTA 텍스트',  type: 'text' },
      { key: 'ctaLink',   label: 'CTA 링크',    type: 'link' },
      { key: 'bgColor',   label: '배경 색상',   type: 'color' },
      { key: 'textColor', label: '텍스트 색상', type: 'color' },
    ],
  },
  {
    key: 'series-carousel',
    label: '시리즈 캐러셀',
    description: '시리즈를 수평 스크롤로 탐색.',
    defaultConfig: {
      title: '시리즈로 읽기',
      seriesIds: [],
      showAll: true,
    } as SeriesCarouselConfig,
    configSchema: [
      { key: 'title',   label: '섹션 제목', type: 'text' },
      { key: 'showAll', label: '전체 시리즈 표시', type: 'boolean' },
    ],
  },
  {
    key: 'article-grid',
    label: '아티클 그리드',
    description: '아카이브 글을 그리드로 표시.',
    defaultConfig: {
      title: '아카이브',
      limit: 9,
    } as ArticleGridConfig,
    configSchema: [
      { key: 'title', label: '섹션 제목', type: 'text' },
      { key: 'limit', label: '표시 개수', type: 'number' },
    ],
  },
  {
    key: 'membership-banner',
    label: '멤버십 배너',
    description: '멤버 가입 유도 CTA 섹션.',
    defaultConfig: {
      headline: '지나간 글은 멤버만 읽을 수 있어요',
      subtext: '이메일 하나로 무료 가입. 모든 아카이브 글과 시리즈를 열람하세요.',
      ctaText: '무료로 멤버 가입하기',
      showBenefits: true,
    } as MembershipBannerConfig,
    configSchema: [
      { key: 'headline',     label: '헤드라인',    type: 'text' },
      { key: 'subtext',      label: '설명 텍스트', type: 'textarea' },
      { key: 'ctaText',      label: 'CTA 텍스트',  type: 'text' },
      { key: 'showBenefits', label: '혜택 목록 표시', type: 'boolean' },
    ],
  },
];

export const REGISTRY_MAP = Object.fromEntries(
  COMPONENT_REGISTRY.map(c => [c.key, c])
);

// ─── Page Component (DB row shape) ───────────────────────

export interface PageComponent {
  id: string;
  page: string;               // e.g. 'home'
  component_key: string;
  enabled: boolean;
  order: number;
  config: ComponentConfig;
  updated_at: string;
}

// ─── Default Home Page Layout ─────────────────────────────
// Supabase 미연동 시 fallback으로 사용

export const DEFAULT_HOME_LAYOUT: Omit<PageComponent, 'id' | 'updated_at'>[] = [
  { page: 'home', component_key: 'promo-banner',      enabled: false, order: 0, config: REGISTRY_MAP['promo-banner'].defaultConfig },
  { page: 'home', component_key: 'hero-today',        enabled: true,  order: 1, config: REGISTRY_MAP['hero-today'].defaultConfig },
  { page: 'home', component_key: 'series-carousel',   enabled: true,  order: 2, config: REGISTRY_MAP['series-carousel'].defaultConfig },
  { page: 'home', component_key: 'article-grid',      enabled: true,  order: 3, config: REGISTRY_MAP['article-grid'].defaultConfig },
  { page: 'home', component_key: 'membership-banner', enabled: true,  order: 4, config: REGISTRY_MAP['membership-banner'].defaultConfig },
];
