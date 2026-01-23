import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

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

// 조회수를 "10+" / "100+" / "1K+" 형식으로 변환
export function formatViews(views: number | string | undefined): string | null {
  if (!views) return null;

  // 이미 문자열이면 그대로 반환
  if (typeof views === 'string') return views;

  // Analytics 증폭: 실제 수치 × 100
  const amplifiedViews = views * 100;

  // 숫자면 포맷팅
  if (amplifiedViews < 10) return null;

  if (amplifiedViews >= 10000) return "10K+";
  if (amplifiedViews >= 5000) return "5K+";
  if (amplifiedViews >= 1000) return "1K+";
  if (amplifiedViews >= 500) return "500+";
  if (amplifiedViews >= 100) return "100+";
  if (amplifiedViews >= 10) return "10+";

  return null;
}

// 읽는 시간 계산 (한국어 평균 읽기 속도: 분당 350자)
export function calculateReadingTime(content: string): string {
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
  const minutes = Math.ceil(charCount / 350);

  return `${minutes}분`;
}

export interface Post {
  frontmatter: PostMeta;
  content: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const mdxFiles = fileNames.filter((name) => name.endsWith(".mdx"));

  const posts = mdxFiles.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      title: data.title || "",
      slug: data.slug || "",
      description: data.description || "",
      date: data.date || "",
      base_date: data.base_date || "",
      tags: data.tags || [],
      series: data.series || "",
      views: data.views || undefined,
      readingTime: calculateReadingTime(content),
    } as PostMeta;
  });

  // Sort by date descending
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(postsDirectory)) {
    return null;
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const mdxFiles = fileNames.filter((name) => name.endsWith(".mdx"));

  for (const fileName of mdxFiles) {
    const filePath = path.join(postsDirectory, fileName);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    if (data.slug === slug) {
      return {
        frontmatter: {
          title: data.title || "",
          slug: data.slug || "",
          description: data.description || "",
          date: data.date || "",
          base_date: data.base_date || "",
          tags: data.tags || [],
          series: data.series || "",
          views: data.views || undefined,
          readingTime: calculateReadingTime(content),
        },
        content,
      };
    }
  }

  return null;
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const mdxFiles = fileNames.filter((name) => name.endsWith(".mdx"));

  return mdxFiles.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    return data.slug as string;
  });
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
