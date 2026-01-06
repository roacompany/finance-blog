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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <header style={{ borderBottom: '1px solid #F2F4F6', padding: '48px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#191F28', letterSpacing: '-0.02em' }}>
            Finance Blog w.ROA
          </h1>
          <p style={{ marginTop: '12px', fontSize: '17px', color: '#8B95A1', lineHeight: 1.6 }}>
            신뢰할 수 있는 금융 정보와 기술 인사이트
          </p>
        </div>
      </header>

      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #F2F4F6'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px' }}>
          <ul style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '16px 0', listStyle: 'none', margin: 0 }}>
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={category === '전체' ? '/' : `/?category=${category}`}
                  style={{
                    display: 'block',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '15px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: selectedCategory === category ? '#191F28' : '#F2F4F6',
                    color: selectedCategory === category ? '#FFFFFF' : '#4E5968',
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
