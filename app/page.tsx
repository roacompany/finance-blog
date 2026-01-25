import Link from 'next/link';
import { getAllPosts } from '@/lib/content';
import type { Metadata } from 'next';
import PostCard from '@/components/PostCard';
import { getContainerClass } from '@/lib/design-system';

const categories = ['전체', '금리', '부동산', '주식', '세금'];
const seriesOptions = [
  { id: 'all', name: '전체' },
  { id: 'Series 00. 프롤로그', name: 'Series 00' },
  { id: 'Series 01. 금리·통화정책', name: 'Series 01' },
  { id: 'Series 02. 실전 대출 가이드', name: 'Series 02' },
];
const BASE_URL = 'https://www.roafinance.me';

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

  const allPosts = getAllPosts().sort(
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

  const recommendedPosts = filteredPosts.length === 0 ? allPosts.slice(0, 3) : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: '금융답게 바라보기, 로아의 시선',
    description: '금융을 금융답게 풀어냅니다.',
    url: BASE_URL,
    author: {
      '@type': 'Person',
      name: '로아',
    },
    publisher: {
      '@type': 'Organization',
      name: '금융답게 바라보기, 로아의 시선',
      url: BASE_URL,
    },
    blogPost: allPosts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: `${BASE_URL}/posts/${post.slug}`,
      datePublished: post.date,
      author: {
        '@type': 'Person',
        name: '로아',
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Page Header */}
      <header className="border-b border-gray-100 py-12 md:py-16">
        <div className={getContainerClass()}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            금융답게 바라보기, 로아의 시선
          </h1>
          <p className="mt-3 text-base md:text-lg text-gray-500 leading-relaxed">
            금융을 금융답게 풀어냅니다.
          </p>

          {/* Series Navigation */}
          <nav className="mt-8">
            <h2 className="text-sm font-semibold text-gray-500 mb-3">시리즈</h2>
            <ul className="flex gap-2 flex-wrap">
              {seriesOptions.map((series) => (
                <li key={series.id}>
                  <Link
                    href={
                      series.id === 'all'
                        ? '/'
                        : `/?series=${encodeURIComponent(series.id)}`
                    }
                    className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      selectedSeries === series.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-transparent text-gray-600 border border-gray-200 hover:border-blue-600 hover:bg-blue-50'
                    }`}
                    scroll={false}
                  >
                    {series.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Category Navigation (only when no series selected) */}
          {selectedSeries === 'all' && (
            <nav className="mt-6">
              <h2 className="text-sm font-semibold text-gray-500 mb-3">카테고리</h2>
              <ul className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <li key={category}>
                    <Link
                      href={category === '전체' ? '/' : `/?category=${category}`}
                      className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        selectedCategory === category
                          ? 'bg-gray-800 text-white'
                          : 'bg-transparent text-gray-600 hover:bg-gray-100'
                      }`}
                      scroll={false}
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className={getContainerClass() + ' py-12 md:py-16'}>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
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
                  작성된 글이 없습니다. 추천 글을 확인해보세요.
                </p>
              </div>

              {/* Recommended Posts */}
              {recommendedPosts.length > 0 && (
                <>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
                    <span>💡</span>
                    <span>추천 글</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedPosts.map((post) => (
                      <PostCard key={post.slug} post={post} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Post Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
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
