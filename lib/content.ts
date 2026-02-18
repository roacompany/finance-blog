import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta {
  title: string;
  slug: string;
  description: string;
  date: string;
  base_date: string;
  tags: string[];
  series: string;
  views?: number | string;
  readingTime?: string;
}

// Re-export formatViews from utils for backward compatibility
export { formatViews } from "./utils";

// 읽는 시간 계산 (한국어 평균 읽기 속도: 분당 350자)
export function calculateReadingTime(content: string): string {
  // null/undefined 체크
  if (!content || typeof content !== 'string') {
    return '1분';
  }

  // 마크다운 문법 제거 (제목, 링크, 코드 블록 등)
  const plainText = content
    .replace(/#{1,6}\s/g, '') // 제목
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 링크
    .replace(/```[\s\S]*?```/g, '') // 코드 블록
    .replace(/`[^`]+`/g, '') // 인라인 코드
    .replace(/[*_~]/g, '') // 강조
    .replace(/\n+/g, ' ') // 줄바꿈
    .trim();

  const charCount = plainText.length;
  const minutes = Math.max(1, Math.ceil(charCount / 350)); // 최소 1분

  return `${minutes}분`;
}

export interface Post {
  frontmatter: PostMeta;
  content: string;
}

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

function parseMdxFile(fileName: string): { data: Record<string, unknown>; content: string; slug: string } | null {
  try {
    const slug = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return { data, content, slug };
  } catch (error) {
    console.error(`[content] Failed to parse ${fileName}:`, error);
    return null;
  }
}

function toPostMeta(data: Record<string, unknown>, slug: string, content: string): PostMeta {
  return {
    title: String(data.title || ''),
    slug,
    description: String(data.description || ''),
    date: String(data.date || ''),
    base_date: String(data.base_date || data.date || ''),
    tags: Array.isArray(data.tags) ? data.tags : [],
    series: String(data.series || ''),
    views: data.views as number | string | undefined,
    readingTime: calculateReadingTime(content),
  };
}

// MDX 파일에서 모든 포스트 가져오기
export function getAllPosts(): PostMeta[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      console.error('[content] Posts directory not found:', postsDirectory);
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.mdx'));
    const posts: PostMeta[] = [];

    for (const fileName of fileNames) {
      const parsed = parseMdxFile(fileName);
      if (parsed) {
        posts.push(toPostMeta(parsed.data, parsed.slug, parsed.content));
      }
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('[content] Failed to get all posts:', error);
    return [];
  }
}

// MDX 파일에서 slug로 포스트 가져오기
export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      frontmatter: toPostMeta(data, slug, content),
      content,
    };
  } catch (error) {
    console.error(`[content] Failed to get post "${slug}":`, error);
    return null;
  }
}

// MDX 파일에서 slug 목록 가져오기
export function getPostSlugs(): string[] {
  try {
    if (!fs.existsSync(postsDirectory)) return [];
    return fs.readdirSync(postsDirectory)
      .filter(f => f.endsWith('.mdx'))
      .map(f => f.replace(/\.mdx$/, ''));
  } catch (error) {
    console.error('[content] Failed to get post slugs:', error);
    return [];
  }
}

// 시리즈별 포스트 가져오기 (날짜 오름차순 정렬)
export function getPostsBySeries(series: string): PostMeta[] {
  const allPosts = getAllPosts();
  return allPosts
    .filter((post) => post.series === series)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// 유사도 계산 함수
function calculateSimilarity(post1: PostMeta, post2: PostMeta): number {
  let score = 0;

  // 같은 시리즈 = 30점
  if (post1.series === post2.series) {
    score += 30;
  }

  // 공통 태그 개수 × 10점
  const commonTags = post1.tags.filter((tag) => post2.tags.includes(tag));
  score += commonTags.length * 10;

  // 날짜 근접성 (7일 이내 = 5점)
  const daysDiff = Math.abs(
    new Date(post1.date).getTime() - new Date(post2.date).getTime()
  ) / (1000 * 60 * 60 * 24);
  if (daysDiff < 7) {
    score += 5;
  }

  return score;
}

// 관련 포스트 가져오기
export function getRelatedPosts(currentPost: PostMeta, limit = 3): PostMeta[] {
  const allPosts = getAllPosts();

  return allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => ({
      post,
      score: calculateSimilarity(currentPost, post),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}
