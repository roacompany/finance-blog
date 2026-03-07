/**
 * Mock data — Supabase 연동 전 UI 개발용
 * Phase 3에서 실제 DB로 교체
 */

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  preview: string;       // 도입부 (Free)
  type: 'letter' | 'deep-dive' | 'series-hub';
  series?: string;
  tags: string[];
  readingTime: number;   // 분
  publishedAt: string;   // ISO
  isToday: boolean;      // 오늘 발행 = 무료
  isFeatured: boolean;
  thumbnailGradient: [string, string]; // [from, to] — 이미지 placeholder
}

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'interest-rate-decision-2026',
    title: '한국은행이 금리를 내리지 못하는 진짜 이유',
    subtitle: '환율과 금리 사이, 한국은행의 딜레마',
    preview: '2026년 들어 시장은 금리 인하를 기대했다. 그러나 한국은행은 움직이지 않았다. 왜일까. 표면적 이유는 물가다. 하지만 진짜 이유는 다른 곳에 있다.',
    type: 'deep-dive',
    series: '금리·통화정책',
    tags: ['금리', '한국은행', '통화정책'],
    readingTime: 8,
    publishedAt: new Date().toISOString(),
    isToday: true,
    isFeatured: true,
    thumbnailGradient: ['#0f2318', '#1a3d2b'],
  },
  {
    id: '2',
    slug: 'cofix-meaning',
    title: 'COFIX가 오르면 내 대출금리는 얼마나 오를까',
    subtitle: '대출금리의 구조를 완전히 해부한다',
    preview: '매달 15일, 은행연합회는 COFIX를 발표한다. 이 숫자 하나가 수백만 명의 월 이자를 바꾼다. 그런데 COFIX가 정확히 무엇인지 아는 사람은 드물다.',
    type: 'deep-dive',
    series: '금리·통화정책',
    tags: ['COFIX', '대출금리', '변동금리'],
    readingTime: 6,
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    isToday: false,
    isFeatured: false,
    thumbnailGradient: ['#12122e', '#1e1e4a'],
  },
  {
    id: '3',
    slug: 'dsr-2026-guide',
    title: 'DSR 3단계, 내 대출 한도가 얼마나 줄었나',
    subtitle: '스트레스 DSR 완전 정복',
    preview: '2026년 스트레스 DSR 3단계 시행으로 대출 한도가 최대 1억 2천만원 줄었다. 이 숫자가 어디서 나왔는지, 내 경우에는 어떻게 계산되는지 직접 따진다.',
    type: 'deep-dive',
    series: '실전 대출',
    tags: ['DSR', 'LTV', '대출한도'],
    readingTime: 9,
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isToday: false,
    isFeatured: false,
    thumbnailGradient: ['#2e0f0f', '#4a1a1a'],
  },
  {
    id: '4',
    slug: 'treasury-yield-inversion',
    title: '장단기 금리 역전, 이번엔 다를까',
    subtitle: '수익률 곡선이 보내는 경기침체 신호',
    preview: '국고채 3년물 금리가 10년물을 웃돌기 시작했다. 역사적으로 이 신호는 12~18개월 후 경기침체를 예고했다. 이번에도 그럴까.',
    type: 'letter',
    series: '금리·통화정책',
    tags: ['국고채', '경기침체', '금리곡선'],
    readingTime: 4,
    publishedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    isToday: false,
    isFeatured: false,
    thumbnailGradient: ['#12202a', '#1e3342'],
  },
  {
    id: '5',
    slug: 'variable-vs-fixed-2026',
    title: '지금 고정금리가 변동금리보다 낮다. 선택은?',
    subtitle: '금리 인하기의 역설적 대출 전략',
    preview: '통상 고정금리는 변동금리보다 높다. 미래 불확실성의 대가다. 그런데 지금은 반대다. 이 역전 현상이 의미하는 것, 그리고 어떻게 선택해야 하는지 따진다.',
    type: 'deep-dive',
    series: '실전 대출',
    tags: ['고정금리', '변동금리', '대출전략'],
    readingTime: 7,
    publishedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    isToday: false,
    isFeatured: false,
    thumbnailGradient: ['#28200f', '#42321a'],
  },
  {
    id: '6',
    slug: 'fed-rate-cut-impact',
    title: '연준이 내리면 한국은행도 내린다? 아니다',
    subtitle: '한미 금리차의 현실',
    preview: '시장은 연준 금리 인하를 한국은행 인하의 선행 신호로 읽는다. 틀렸다. 둘의 금리는 다른 논리로 움직인다. 왜 그런지 처음부터 설명한다.',
    type: 'deep-dive',
    series: '금리·통화정책',
    tags: ['연준', 'Fed', '한국은행', '환율'],
    readingTime: 7,
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    isToday: false,
    isFeatured: false,
    thumbnailGradient: ['#1a1228', '#2a1e40'],
  },
];

export const MOCK_SERIES = [
  { id: 'interest-rate', label: '금리·통화정책', count: 8 },
  { id: 'loan',          label: '실전 대출',     count: 5 },
  { id: 'investment',    label: '투자 기초',      count: 0 },
  { id: 'etf',           label: 'ETF·펀드',      count: 0 },
  { id: 'tax',           label: '세금·절세',      count: 0 },
];
