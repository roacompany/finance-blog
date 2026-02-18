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
  if (!content || typeof content !== 'string') {
    return '1분';
  }

  const plainText = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/[*_~]/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  const charCount = plainText.length;
  const minutes = Math.max(1, Math.ceil(charCount / 350));

  return `${minutes}분`;
}

export interface Post {
  frontmatter: PostMeta;
  content: string;
}

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

// ─── Private: MDX 파일 읽기 (동기, 항상 사용 가능) ───

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

function getMdxPosts(): PostMeta[] {
  try {
    if (!fs.existsSync(postsDirectory)) return [];
    const fileNames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.mdx'));
    const posts: PostMeta[] = [];
    for (const fileName of fileNames) {
      const parsed = parseMdxFile(fileName);
      if (parsed) {
        posts.push(toPostMeta(parsed.data, parsed.slug, parsed.content));
      }
    }
    return posts;
  } catch (error) {
    console.error('[content] Failed to read MDX posts:', error);
    return [];
  }
}

function getMdxPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      frontmatter: toPostMeta(data, slug, content),
      content,
    };
  } catch {
    return null;
  }
}

function getMdxSlugs(): string[] {
  try {
    if (!fs.existsSync(postsDirectory)) return [];
    return fs.readdirSync(postsDirectory)
      .filter(f => f.endsWith('.mdx'))
      .map(f => f.replace(/\.mdx$/, ''));
  } catch {
    return [];
  }
}

// ─── Private: DB에서 발행된 포스트 읽기 (비동기, 실패 시 무시) ───

async function getDbPublishedPosts(): Promise<PostMeta[]> {
  try {
    const { getPublishedPosts } = await import('./posts-db');
    return await getPublishedPosts();
  } catch {
    return [];
  }
}

async function getDbPublishedPostBySlug(slug: string): Promise<Post | null> {
  try {
    const { getPublishedPostBySlug } = await import('./posts-db');
    return await getPublishedPostBySlug(slug);
  } catch {
    return null;
  }
}

async function getDbPublishedSlugs(): Promise<string[]> {
  try {
    const { getPublishedSlugs } = await import('./posts-db');
    return await getPublishedSlugs();
  } catch {
    return [];
  }
}

// ─── Public: MDX + DB 통합 (비동기) ───

// slug 기준 중복 제거. DB 버전이 MDX에 없는 경우에만 추가.
function mergePosts(mdxPosts: PostMeta[], dbPosts: PostMeta[]): PostMeta[] {
  const mdxSlugs = new Set(mdxPosts.map(p => p.slug));
  const dbOnlyPosts = dbPosts.filter(p => !mdxSlugs.has(p.slug));
  return [...mdxPosts, ...dbOnlyPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// 모든 발행 포스트 가져오기 (MDX + DB 통합)
export async function getAllPosts(): Promise<PostMeta[]> {
  const mdxPosts = getMdxPosts();
  const dbPosts = await getDbPublishedPosts();
  return mergePosts(mdxPosts, dbPosts);
}

// slug로 포스트 가져오기 (MDX 우선, 없으면 DB)
export async function getPostBySlug(slug: string): Promise<Post | null> {
  // MDX 먼저 확인
  const mdxPost = getMdxPostBySlug(slug);
  if (mdxPost) return mdxPost;

  // MDX에 없으면 DB에서 찾기
  return getDbPublishedPostBySlug(slug);
}

// 발행된 slug 목록 (MDX + DB 통합)
export async function getPostSlugs(): Promise<string[]> {
  const mdxSlugs = getMdxSlugs();
  const dbSlugs = await getDbPublishedSlugs();
  const allSlugs = new Set([...mdxSlugs, ...dbSlugs]);
  return Array.from(allSlugs);
}

// 시리즈별 포스트 (날짜 오름차순)
export async function getPostsBySeries(series: string): Promise<PostMeta[]> {
  const allPosts = await getAllPosts();
  return allPosts
    .filter((post) => post.series === series)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// 유사도 계산
function calculateSimilarity(post1: PostMeta, post2: PostMeta): number {
  let score = 0;
  if (post1.series && post1.series === post2.series) score += 30;
  const commonTags = post1.tags.filter((tag) => post2.tags.includes(tag));
  score += commonTags.length * 10;
  const daysDiff = Math.abs(
    new Date(post1.date).getTime() - new Date(post2.date).getTime()
  ) / (1000 * 60 * 60 * 24);
  if (daysDiff < 7) score += 5;
  return score;
}

// 관련 포스트 가져오기
export async function getRelatedPosts(currentPost: PostMeta, limit = 3): Promise<PostMeta[]> {
  const allPosts = await getAllPosts();
  return allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => ({ post, score: calculateSimilarity(currentPost, post) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

// ─── MDX → DB 동기화 (DB 초기화 시 호출) ───

export function readAllMdxFiles(): { slug: string; title: string; description: string; content: string; date: string; base_date: string; tags: string[]; series: string; views: number | string | undefined }[] {
  try {
    if (!fs.existsSync(postsDirectory)) return [];
    const fileNames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.mdx'));
    const posts = [];
    for (const fileName of fileNames) {
      const parsed = parseMdxFile(fileName);
      if (parsed) {
        const { data, content, slug } = parsed;
        posts.push({
          slug,
          title: String(data.title || ''),
          description: String(data.description || ''),
          content,
          date: String(data.date || ''),
          base_date: String(data.base_date || data.date || ''),
          tags: Array.isArray(data.tags) ? data.tags : [],
          series: String(data.series || ''),
          views: data.views as number | string | undefined,
        });
      }
    }
    return posts;
  } catch {
    return [];
  }
}
