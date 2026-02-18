import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content";

const BASE_URL = "https://www.roafinance.me";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const postUrls = posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.base_date || post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // 시리즈 페이지
  const seriesUrls = [
    {
      url: `${BASE_URL}/?series=Series%2000.%20%ED%94%84%EB%A1%A4%EB%A1%9C%EA%B7%B8`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/?series=Series%2001.%20%EA%B8%88%EB%A6%AC%C2%B7%ED%86%B5%ED%99%94%EC%A0%95%EC%B1%85`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/?series=Series%2002.%20%EC%8B%A4%EC%A0%84%20%EB%8C%80%EC%B6%9C%20%EA%B0%80%EC%9D%B4%EB%93%9C`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ];

  // 카테고리 페이지
  const categoryUrls = [
    {
      url: `${BASE_URL}/?category=금리`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/?category=부동산`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/?category=주식`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/?category=세금`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...seriesUrls,
    ...categoryUrls,
    ...postUrls,
  ];
}
