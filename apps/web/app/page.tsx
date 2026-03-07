export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/content';
import { postsToArticles } from '@/lib/posts-feed';
import { getPageComponents } from '@/lib/page-components';
import { HeroArticle }      from '@/components/editorial/HeroArticle';
import { SeriesCarousel }   from '@/components/editorial/SeriesCarousel';
import { ArticleGrid }      from '@/components/editorial/ArticleGrid';
import { MembershipBanner } from '@/components/editorial/MembershipBanner';
import { PromoBanner }      from '@/components/editorial/PromoBanner';
import type {
  HeroTodayConfig,
  SeriesCarouselConfig,
  ArticleGridConfig,
  MembershipBannerConfig,
  PromoBannerConfig,
} from '@/lib/component-registry';

export const metadata: Metadata = {
  title: 'ROA — 금융 인사이트 미디어',
  description: '금융을 깊이 이해하는 사람들을 위한 인사이트 미디어. 매일 하나의 깊은 금융 이야기.',
};

export default async function Home() {
  // 실제 MDX + DB 포스트 fetch
  const posts   = await getAllPosts();
  const articles = postsToArticles(posts);
  const todayArticle    = articles.find(a => a.isToday) ?? articles[0];
  const archiveArticles = articles.filter(a => !a.isToday);

  // Supabase에서 페이지 레이아웃 fetch (실패 시 fallback)
  // 시리즈별 포스트 수 동적 추출
  const seriesMap = new Map<string, number>();
  posts.forEach(p => {
    if (p.series) seriesMap.set(p.series, (seriesMap.get(p.series) ?? 0) + 1);
  });
  const seriesList = Array.from(seriesMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count]) => ({
      id: name,
      label: name.replace(/^Series \d+\.\s*/, ''),
      count,
    }));

  const layout  = await getPageComponents('home');
  const enabled = layout
    .filter(c => c.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {enabled.map(component => {
        switch (component.component_key) {
          case 'promo-banner':
            return (
              <PromoBanner
                key={component.id}
                config={component.config as PromoBannerConfig}
              />
            );
          case 'hero-today':
            return todayArticle ? (
              <HeroArticle
                key={component.id}
                article={todayArticle}
                config={component.config as HeroTodayConfig}
              />
            ) : null;
          case 'series-carousel':
            return (
              <SeriesCarousel
                key={component.id}
                series={seriesList}
                config={component.config as SeriesCarouselConfig}
              />
            );
          case 'article-grid':
            return (
              <ArticleGrid
                key={component.id}
                articles={archiveArticles}
                config={component.config as ArticleGridConfig}
              />
            );
          case 'membership-banner':
            return (
              <MembershipBanner
                key={component.id}
                config={component.config as MembershipBannerConfig}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
