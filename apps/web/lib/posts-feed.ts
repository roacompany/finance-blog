/**
 * posts-feed — PostMeta → Article 어댑터
 *
 * content.ts의 PostMeta를 editorial 컴포넌트(HeroArticle, ArticleGrid)가
 * 사용하는 Article 타입으로 변환한다.
 */

import type { PostMeta } from './content';
import type { Article } from './mock-data';

// 태그 키워드 → 썸네일 그라디언트
const GRADIENT_MAP: Record<string, [string, string]> = {
  '금리': ['#0f2318', '#1a3d2b'],
  '대출': ['#2e0f0f', '#4a1a1a'],
  '투자': ['#12122e', '#1e1e4a'],
  '세금': ['#28200f', '#42321a'],
  '통화': ['#1a2228', '#2d3a42'],
  'ETF':  ['#12122e', '#1e1e4a'],
  '채권': ['#0f2318', '#1a3d2b'],
};

const FALLBACK_GRADIENT: [string, string] = ['#111', '#1a1a2a'];

function deriveThumbnailGradient(tags: string[]): [string, string] {
  for (const tag of tags) {
    for (const [key, gradient] of Object.entries(GRADIENT_MAP)) {
      if (tag.includes(key)) return gradient;
    }
  }
  return FALLBACK_GRADIENT;
}

function deriveType(series: string): Article['type'] {
  if (series) return 'deep-dive';
  return 'letter';
}

function isTodayKST(dateStr: string): boolean {
  const todayKST = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
  return dateStr.startsWith(todayKST);
}

function parseReadingTimeNumber(rt: string | undefined): number {
  if (!rt) return 5;
  const n = parseInt(rt, 10);
  return isNaN(n) ? 5 : n;
}

export function postMetaToArticle(post: PostMeta, index: number): Article {
  const tags = post.tags ?? [];
  return {
    id:                post.slug,       // slug는 고유 — index보다 안전
    slug:              post.slug,
    title:             post.title,
    subtitle:          post.description,
    preview:           post.description,
    type:              deriveType(post.series),
    series:            post.series || undefined,
    tags,
    readingTime:       parseReadingTimeNumber(post.readingTime),
    publishedAt:       post.date,
    isToday:           isTodayKST(post.date),
    isFeatured:        index === 0,
    thumbnailGradient: deriveThumbnailGradient(tags),
  };
}

export function postsToArticles(posts: PostMeta[]): Article[] {
  return posts.map((p, i) => postMetaToArticle(p, i));
}
