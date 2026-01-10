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
  views?: number;
}

// 조회수를 "10+" / "100+" / "1K+" 형식으로 변환
export function formatViews(views: number | undefined): string | null {
  if (!views || views < 10) return null;

  if (views >= 10000) return "10K+";
  if (views >= 5000) return "5K+";
  if (views >= 1000) return "1K+";
  if (views >= 500) return "500+";
  if (views >= 100) return "100+";
  if (views >= 10) return "10+";

  return null;
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
    const { data } = matter(fileContent);

    return {
      title: data.title || "",
      slug: data.slug || "",
      description: data.description || "",
      date: data.date || "",
      base_date: data.base_date || "",
      tags: data.tags || [],
      series: data.series || "",
      views: data.views || undefined,
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
