import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content";

const BASE_URL = "https://www.roafinance.me";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  // 포스트 URL
  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.base_date || post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 시리즈 URL — 포스트에서 동적 추출 (중복 제거)
  const seriesSet = new Set(posts.map((p) => p.series).filter(Boolean));
  const seriesUrls: MetadataRoute.Sitemap = Array.from(seriesSet).map((series) => {
    const latest = posts
      .filter((p) => p.series === series)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    return {
      url: `${BASE_URL}/?series=${encodeURIComponent(series)}`,
      lastModified: latest ? new Date(latest.date) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    };
  });

  // 고정 페이지
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/membership`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...seriesUrls,
    ...staticUrls,
    ...postUrls,
  ];
}
