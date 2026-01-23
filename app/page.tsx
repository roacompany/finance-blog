import Link from "next/link";
import { getAllPosts, formatViews } from "@/lib/content";
import type { Metadata } from "next";

const categories = ["전체", "금리", "부동산", "주식", "세금"];
const seriesOptions = [
  { id: "all", name: "전체" },
  { id: "Series 00. 프롤로그", name: "Series 00" },
  { id: "Series 01. 금리·통화정책", name: "Series 01" },
  { id: "Series 02. 실전 대출 가이드", name: "Series 02" },
];
const BASE_URL = "https://www.roafinance.me";

// 태그별 gradient 색상
function getTagGradient(tags: string[]): string {
  const firstTag = tags[0] || "기본";

  const gradients: Record<string, string> = {
    "금리": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "실전": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "기초": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "해외여행": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "절약": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "투자심화": "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    "한국은행": "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "대출": "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "계산기": "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  };

  return gradients[firstTag] || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
}

// 태그별 텍스트 색상
function getTagColor(tag: string): string {
  const colors: Record<string, string> = {
    "금리": "#667eea",
    "실전": "#f5576c",
    "기초": "#4facfe",
    "해외여행": "#38f9d7",
    "절약": "#fa709a",
    "투자심화": "#330867",
    "한국은행": "#30cfd0",
    "대출": "#ff9a9e",
    "계산기": "#fcb69f",
  };

  return colors[tag] || "#667eea";
}

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
                      <Link
                        key={post.slug}
                        href={`/posts/${post.slug}`}
                        style={{ display: 'block', textDecoration: 'none' }}
                      >
                        <article style={{
                          borderRadius: '16px',
                          overflow: 'hidden',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E5E8EB',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)';
                          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}>
                          <div style={{
                            height: '180px',
                            background: getTagGradient(post.tags),
                            position: 'relative'
                          }} />
                          <div style={{ padding: '24px' }}>
                            <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {post.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: getTagColor(tag),
                                    backgroundColor: `${getTagColor(tag)}15`,
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <h4 style={{
                              marginBottom: '8px',
                              fontSize: '18px',
                              fontWeight: 700,
                              color: '#191F28',
                              lineHeight: 1.4,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {post.title}
                            </h4>
                            <p style={{
                              marginBottom: '16px',
                              fontSize: '14px',
                              lineHeight: 1.6,
                              color: '#6B7684',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {post.description}
                            </p>
                            <div style={{
                              fontSize: '13px',
                              color: '#8B95A1',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              flexWrap: 'wrap'
                            }}>
                              <time dateTime={post.date}>{post.date}</time>
                              {post.readingTime && (
                                <>
                                  <span style={{ color: '#E5E8EB' }}>·</span>
                                  <span>{post.readingTime}</span>
                                </>
                              )}
                              {formatViews(post.views) && (
                                <>
                                  <span style={{ color: '#E5E8EB' }}>·</span>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                      <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    {formatViews(post.views)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </article>
                      </Link>
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
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  <article style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E8EB',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{
                      height: '180px',
                      background: getTagGradient(post.tags),
                      position: 'relative'
                    }} />
                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: '12px',
                              fontWeight: 700,
                              color: getTagColor(tag),
                              backgroundColor: `${getTagColor(tag)}15`,
                              padding: '4px 10px',
                              borderRadius: '6px',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 style={{
                        marginBottom: '8px',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#191F28',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {post.title}
                      </h3>
                      <p style={{
                        marginBottom: '16px',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: '#6B7684',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flex: 1
                      }}>
                        {post.description}
                      </p>
                      <div style={{
                        fontSize: '13px',
                        color: '#8B95A1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap'
                      }}>
                        <time dateTime={post.date}>{post.date}</time>
                        {post.readingTime && (
                          <>
                            <span style={{ color: '#E5E8EB' }}>·</span>
                            <span>{post.readingTime}</span>
                          </>
                        )}
                        {formatViews(post.views) && (
                          <>
                            <span style={{ color: '#E5E8EB' }}>·</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              {formatViews(post.views)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
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
