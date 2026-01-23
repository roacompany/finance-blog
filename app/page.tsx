import Link from "next/link";
import { getAllPosts } from "@/lib/content";
import type { Metadata } from "next";
import PostCard from "@/components/PostCard";

const categories = ["전체", "금리", "부동산", "주식", "세금"];
const seriesOptions = [
  { id: "all", name: "전체" },
  { id: "Series 00. 프롤로그", name: "Series 00" },
  { id: "Series 01. 금리·통화정책", name: "Series 01" },
  { id: "Series 02. 실전 대출 가이드", name: "Series 02" },
];
const BASE_URL = "https://www.roafinance.me";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const selectedCategory = typeof searchParams.category === 'string' ? searchParams.category : '전체';
  const selectedSeries = typeof searchParams.series === 'string' ? searchParams.series : 'all';

  let title = '금융답게 바라보기, 로아의 시선';
  if (selectedSeries !== 'all') {
    const series = seriesOptions.find(s => s.id === selectedSeries);
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
  const selectedCategory = typeof searchParams.category === 'string' ? searchParams.category : '전체';
  const selectedSeries = typeof searchParams.series === 'string' ? searchParams.series : 'all';

  const allPosts = getAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let filteredPosts = allPosts;
  if (selectedSeries !== 'all') {
    filteredPosts = filteredPosts.filter((post) => post.series === selectedSeries);
  } else if (selectedCategory !== '전체') {
    filteredPosts = filteredPosts.filter((post) => post.tags && post.tags.includes(selectedCategory));
  }

  const recommendedPosts = filteredPosts.length === 0
    ? allPosts.slice(0, 3)
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "금융답게 바라보기, 로아의 시선",
    "description": "금융을 금융답게 풀어냅니다.",
    "url": BASE_URL,
    "author": {
      "@type": "Person",
      "name": "로아"
    },
    "publisher": {
      "@type": "Organization",
      "name": "금융답게 바라보기, 로아의 시선",
      "url": BASE_URL
    },
    "blogPost": allPosts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "url": `${BASE_URL}/posts/${post.slug}`,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": "로아"
      }
    }))
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header style={{ borderBottom: '1px solid #F2F4F6', padding: '48px 24px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#191F28', letterSpacing: '-0.02em' }}>
            금융답게 바라보기, 로아의 시선
          </h1>
          <p style={{ marginTop: '12px', fontSize: '17px', color: '#8B95A1', lineHeight: 1.6 }}>
            금융을 금융답게 풀어냅니다.
          </p>

          <nav style={{ marginTop: '32px' }}>
            <h2 style={{ margin: 0, marginBottom: '12px', fontSize: '14px', fontWeight: 600, color: '#8B95A1' }}>
              시리즈
            </h2>
            <ul style={{
              display: 'flex',
              gap: '8px',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              flexWrap: 'wrap'
            }}>
              {seriesOptions.map((series) => (
                <li key={series.id}>
                  <Link
                    href={series.id === 'all' ? '/' : `/?series=${encodeURIComponent(series.id)}`}
                    style={{
                      display: 'block',
                      padding: '10px 18px',
                      borderRadius: '14px',
                      fontSize: '14px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: selectedSeries === series.id ? '#3182F6' : 'transparent',
                      color: selectedSeries === series.id ? '#FFFFFF' : '#8B95A1',
                      border: selectedSeries === series.id ? 'none' : '1px solid #E5E8EB',
                    }}
                    scroll={false}
                  >
                    {series.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {selectedSeries === 'all' && (
            <nav style={{ marginTop: '24px' }}>
              <h2 style={{ margin: 0, marginBottom: '12px', fontSize: '14px', fontWeight: 600, color: '#8B95A1' }}>
                카테고리
              </h2>
              <ul style={{
                display: 'flex',
                gap: '8px',
                listStyle: 'none',
                margin: 0,
                padding: 0,
                flexWrap: 'wrap'
              }}>
                {categories.map((category) => (
                  <li key={category}>
                    <Link
                      href={category === '전체' ? '/' : `/?category=${category}`}
                      style={{
                        display: 'block',
                        padding: '10px 18px',
                        borderRadius: '14px',
                        fontSize: '14px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        backgroundColor: selectedCategory === category ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                        color: selectedCategory === category ? '#191F28' : '#8B95A1',
                      }}
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

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        <section>
          <h2 style={{ marginBottom: '32px', fontSize: '24px', fontWeight: 700, color: '#191F28' }}>
            {selectedSeries !== 'all'
              ? seriesOptions.find(s => s.id === selectedSeries)?.name || 'Insights'
              : selectedCategory === '전체' ? 'Insights' : selectedCategory}
          </h2>

          {filteredPosts.length === 0 ? (
            <div style={{ padding: '40px 0' }}>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p style={{ color: '#8B95A1', fontSize: '17px', marginBottom: '8px' }}>아직 작성된 글이 없습니다.</p>
                <p style={{ color: '#B0B8C1', fontSize: '14px' }}>다른 추천 글을 확인해보세요.</p>
              </div>

              {recommendedPosts.length > 0 && (
                <>
                  <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: 700, color: '#191F28', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>💡</span>
                    <span>추천 글</span>
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '24px'
                  }}>
                    {recommendedPosts.map((post) => (
                      <PostCard key={post.slug} post={post} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {filteredPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer style={{
        borderTop: '1px solid #F2F4F6',
        padding: '48px 24px',
        marginTop: '48px',
        backgroundColor: '#F9FAFB'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <nav style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <Link
              href="/about"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#4E5968',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
            >
              About
            </Link>
            <span style={{ color: '#E5E8EB' }}>·</span>
            <Link
              href="/privacy"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#4E5968',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
            >
              Privacy
            </Link>
            <span style={{ color: '#E5E8EB' }}>·</span>
            <Link
              href="/contact"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#4E5968',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
            >
              Contact
            </Link>
          </nav>

          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <p style={{
              fontSize: '13px',
              color: '#8B95A1',
              lineHeight: 1.6,
              margin: '0 auto',
              maxWidth: '600px'
            }}>
              본 사이트의 모든 정보는 교육 목적으로 제공되며, 투자 권유가 아닙니다.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#B0B8C1', margin: 0 }}>
              © 2026 ROA Finance. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
