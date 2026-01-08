import Link from "next/link";
import { getAllPosts, formatViews } from "@/lib/content";

const categories = ["전체", "금리", "부동산", "주식", "세금"];

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home(props: Props) {
  const searchParams = await props.searchParams;
  const selectedCategory = typeof searchParams.category === 'string' ? searchParams.category : '전체';

  const allPosts = getAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filteredPosts = selectedCategory === '전체'
    ? allPosts
    : allPosts.filter((post) => post.tags && post.tags.includes(selectedCategory));

  // JSON-LD 구조화 데이터
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "금융답게 바라보기, 로아의 시선",
    "description": "금융을 금융답게 풀어냅니다.",
    "url": "https://www.roafinance.me",
    "author": {
      "@type": "Person",
      "name": "로아"
    },
    "publisher": {
      "@type": "Organization",
      "name": "금융답게 바라보기, 로아의 시선",
      "url": "https://www.roafinance.me"
    },
    "blogPost": allPosts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "url": `https://www.roafinance.me/posts/${post.slug}`,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": "로아"
      }
    }))
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', paddingBottom: '100px' }}>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header style={{ borderBottom: '1px solid #F2F4F6', padding: '48px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#191F28', letterSpacing: '-0.02em' }}>
            금융답게 바라보기, 로아의 시선
          </h1>
          <p style={{ marginTop: '12px', fontSize: '17px', color: '#8B95A1', lineHeight: 1.6 }}>
            금융을 금융답게 풀어냅니다.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 24px' }}>
        <section>
          <h2 style={{ marginBottom: '32px', fontSize: '24px', fontWeight: 700, color: '#191F28' }}>
            {selectedCategory === '전체' ? 'Insights' : selectedCategory}
          </h2>

          {filteredPosts.length === 0 ? (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <p style={{ color: '#8B95A1', fontSize: '17px' }}>아직 작성된 글이 없습니다.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  <article style={{ borderBottom: '1px solid #F2F4F6', paddingBottom: '32px' }}>
                    <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#3182F6',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 style={{
                      marginBottom: '12px',
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#191F28',
                      lineHeight: 1.4
                    }}>
                      {post.title}
                    </h3>
                    <p style={{
                      marginBottom: '12px',
                      fontSize: '16px',
                      lineHeight: 1.6,
                      color: '#4E5968',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {post.description}
                    </p>
                    <div style={{
                      fontSize: '14px',
                      color: '#8B95A1',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <time dateTime={post.date}>{post.date}</time>
                      {formatViews(post.views) && (
                        <>
                          <span style={{ color: '#E5E8EB' }}>·</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            {formatViews(post.views)}
                          </span>
                        </>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* iOS Style Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        maxWidth: 'calc(100% - 40px)',
        width: 'fit-content',
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          borderRadius: '20px',
          padding: '8px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1)',
          border: '0.5px solid rgba(255, 255, 255, 0.3)',
        }}>
          <ul style={{
            display: 'flex',
            gap: '6px',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            alignItems: 'center'
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
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: selectedCategory === category
                      ? 'rgba(0, 0, 0, 0.06)'
                      : 'transparent',
                    color: selectedCategory === category ? '#191F28' : '#8B95A1',
                    whiteSpace: 'nowrap',
                  }}
                  scroll={false}
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <footer style={{
        borderTop: '1px solid #F2F4F6',
        padding: '48px 24px',
        marginTop: '48px',
        backgroundColor: '#F9FAFB'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#8B95A1' }}>Financial Tech Blog © 2026</p>
        </div>
      </footer>
    </div>
  );
}
