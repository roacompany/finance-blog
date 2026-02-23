import { getAllPosts } from '@/lib/content';
import type { Metadata } from 'next';
import PostCard from '@/components/PostCard';
import HeroCard from '@/components/HeroCard';
import FeedTabs from '@/components/FeedTabs';
// Container: 1140px, padding 22px/40px (토스피드 스펙)
const containerClass = 'max-w-[1140px] mx-auto px-[22px] md:px-10';

const categories = ['전체', '금리', '부동산', '주식', '세금'];
const seriesOptions = [
  { id: 'all', name: '전체' },
  { id: 'Series 00. 프롤로그', name: 'Series 00' },
  { id: 'Series 01. 금리·통화정책', name: 'Series 01' },
  { id: 'Series 02. 실전 대출 가이드', name: 'Series 02' },
];
const BASE_URL = 'https://www.roafinance.me';

const seriesBgColors: Record<string, string> = {
  'Series 00. 프롤로그': 'bg-amber-50/60',
  'Series 01. 금리·통화정책': 'bg-blue-50/60',
  'Series 02. 실전 대출 가이드': 'bg-green-50/60',
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const selectedCategory =
    typeof searchParams.category === 'string' ? searchParams.category : '전체';
  const selectedSeries =
    typeof searchParams.series === 'string' ? searchParams.series : 'all';

  let title = '금융답게 바라보기, 로아의 시선';
  if (selectedSeries !== 'all') {
    const series = seriesOptions.find((s) => s.id === selectedSeries);
    title = `${series?.name || selectedSeries} - 금융답게 바라보기, 로아의 시선`;
  } else if (selectedCategory !== '전체') {
    title = `${selectedCategory} - 금융답게 바라보기, 로아의 시선`;
  }

  const description = '금융을 금융답게 풀어냅니다.';

  return {
    title,
    description,
    alternates: {
      canonical: BASE_URL,
    },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url: BASE_URL,
      siteName: '금융답게 바라보기, 로아의 시선',
      title,
      description,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: '금융답게 바라보기, 로아의 시선',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default async function Home(props: Props) {
  const searchParams = await props.searchParams;
  const selectedCategory =
    typeof searchParams.category === 'string' ? searchParams.category : '전체';
  const selectedSeries =
    typeof searchParams.series === 'string' ? searchParams.series : 'all';

  const allPosts = (await getAllPosts()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let filteredPosts = allPosts;
  if (selectedSeries !== 'all') {
    filteredPosts = filteredPosts.filter((post) => post.series === selectedSeries);
  } else if (selectedCategory !== '전체') {
    filteredPosts = filteredPosts.filter(
      (post) => post.tags && post.tags.includes(selectedCategory)
    );
  }

  const heroPost = filteredPosts[0] ?? null;
  const gridPosts = filteredPosts.slice(1);

  const tabs = [
    { id: 'all', label: '전체', href: '/' },
    ...seriesOptions.filter(s => s.id !== 'all').map(s => ({
      id: s.id, label: s.name, href: `/?series=${encodeURIComponent(s.id)}`,
    })),
    ...categories.filter(c => c !== '전체').map(c => ({
      id: `cat-${c}`, label: c, href: `/?category=${c}`,
    })),
  ];

  const activeTabId = selectedSeries !== 'all'
    ? selectedSeries
    : selectedCategory !== '전체' ? `cat-${selectedCategory}` : 'all';

  const recommendedPosts = filteredPosts.length === 0 ? allPosts.slice(0, 3) : [];

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: '금융답게 바라보기, 로아의 시선',
    description: '금융을 금융답게 풀어냅니다.',
    url: BASE_URL,
    inLanguage: 'ko',
    author: {
      '@type': 'Person',
      name: '로아',
    },
    publisher: {
      '@type': 'Organization',
      name: '금융답게 바라보기, 로아의 시선',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/og-image.png`,
      },
    },
    blogPost: allPosts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: `${BASE_URL}/posts/${post.slug}`,
      datePublished: post.date,
      image: `${BASE_URL}/api/og?title=${encodeURIComponent(post.title)}`,
      author: {
        '@type': 'Person',
        name: '로아',
      },
    })),
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '금융답게 바라보기, 로아의 시선',
    url: BASE_URL,
    description: '금융을 금융답게 풀어냅니다.',
    inLanguage: 'ko',
    publisher: {
      '@type': 'Organization',
      name: '금융답게 바라보기, 로아의 시선',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* Page Header */}
      <header className="border-b border-gray-100 py-12 md:py-16">
        <div className={containerClass}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            <span className="md:hidden">로아의 시선</span>
            <span className="hidden md:inline">금융답게 바라보기, 로아의 시선</span>
          </h1>
          <p className="mt-3 text-base md:text-lg text-gray-500 leading-relaxed">
            금융을 금융답게 풀어냅니다.
          </p>

          <FeedTabs tabs={tabs} activeTabId={activeTabId} />
        </div>
      </header>

      {/* Main Content */}
      <main className={`${containerClass} py-12 md:py-16 ${selectedSeries !== 'all' ? (seriesBgColors[selectedSeries] || '') : ''}`}>
        <section>
          <h2 className="text-[26px] font-bold text-gray-900 mb-8">
            {selectedSeries !== 'all'
              ? seriesOptions.find((s) => s.id === selectedSeries)?.name || '최신 글'
              : selectedCategory === '전체'
              ? '최신 글'
              : selectedCategory}
          </h2>

          {/* Empty State */}
          {filteredPosts.length === 0 ? (
            <div className="py-10">
              <div className="text-center mb-12">
                <p className="text-gray-500 text-lg">
                  아직 글이 없어요.
                </p>
              </div>

              {/* Recommended Posts */}
              {recommendedPosts.length > 0 && (
                <>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
                    <span>💡</span>
                    <span>추천 글</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-10">
                    {recommendedPosts.map((post) => (
                      <PostCard key={post.slug} post={post} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-[60px]">
              {/* Hero Card */}
              {heroPost && <HeroCard post={heroPost} />}

              {/* Post Grid */}
              {gridPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-10">
                  {gridPosts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Disclaimer */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center max-w-2xl mx-auto leading-relaxed">
            본 사이트의 모든 정보는 교육 목적으로 제공되며, 투자 권유가 아닙니다.
          </p>
        </div>
      </main>
    </>
  );
}
