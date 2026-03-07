import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPostBySlug, getPostSlugs, calculateReadingTime } from '@/lib/content';
import { SafeMDXRemote } from '@/components/SafeMDXRemote';
import { ReadingProgress } from '@/components/article/ReadingProgress';
import { PaywallGate } from '@/components/article/PaywallGate';
import { ArticleHeader } from '@/components/article/ArticleHeader';
import { getMDXComponents } from './mdx-components';

const BASE_URL = 'https://www.roafinance.me';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/* ─── 오늘(KST 기준) 여부 판단 ─── */
function isTodayKST(dateStr: string): boolean {
  const todayKST = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }); // "YYYY-MM-DD"
  return dateStr.startsWith(todayKST);
}

function formatDateKR(dateStr: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Seoul',
  }).format(new Date(dateStr));
}

/* ─── Static Params ─── */
export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

/* ─── Metadata ─── */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let post;
  try { post = await getPostBySlug(slug); } catch { return { title: 'Error' }; }
  if (!post) return { title: '글을 찾을 수 없어요' };

  const { frontmatter } = post;
  const url = `${BASE_URL}/posts/${slug}`;
  const ogUrl = `${BASE_URL}/api/og?title=${encodeURIComponent(frontmatter.title)}&desc=${encodeURIComponent(frontmatter.description)}&tags=${encodeURIComponent((frontmatter.tags ?? []).join(','))}`;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.tags,
    openGraph: {
      type: 'article', locale: 'ko_KR', url,
      title: frontmatter.title, description: frontmatter.description,
      publishedTime: frontmatter.date,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: frontmatter.title }],
    },
    twitter: { card: 'summary_large_image', title: frontmatter.title, description: frontmatter.description, images: [ogUrl] },
    alternates: { canonical: url },
  };
}

/* ─── Page ─── */
export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch (err) {
    console.error(`[PostPage] "${slug}" 로드 실패:`, err);
    notFound();
  }
  if (!post) notFound();

  const { frontmatter, content } = post;
  const readingTime = calculateReadingTime(content);
  const isToday = isTodayKST(frontmatter.date);

  // 아티클 타입별 썸네일 그라디언트 (임시 — Phase 3에서 실제 이미지로)
  const GRADIENT_MAP: Record<string, [string, string]> = {
    '금리': ['#0f2318', '#1a3d2b'],
    '대출': ['#2e0f0f', '#4a1a1a'],
    '투자': ['#12122e', '#1e1e4a'],
    '세금': ['#28200f', '#42321a'],
    '통화': ['#1a2228', '#2d3a42'],
  };
  const tag = (frontmatter.tags ?? [])[0] ?? '';
  const gradientKey = Object.keys(GRADIENT_MAP).find(k => tag.includes(k)) ?? '';
  const [gradFrom, gradTo] = GRADIENT_MAP[gradientKey] ?? ['#111', '#1a1a2a'];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: { '@type': 'Organization', name: 'ROA Finance', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'ROA Finance',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/icon.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/posts/${slug}` },
    keywords: (frontmatter.tags ?? []).join(', '),
    image: `${BASE_URL}/api/og?title=${encodeURIComponent(frontmatter.title)}&desc=${encodeURIComponent(frontmatter.description)}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 읽기 진행 바 */}
      <ReadingProgress />

      <div style={{ backgroundColor: 'var(--roa-bg-base)', minHeight: '100vh' }}>

        {/* ═══ 아티클 헤더 ═══ */}
        <header className="px-5 pt-28 pb-10" style={{ borderBottom: '1px solid var(--roa-border-subtle)' }}>
          <div className="mx-auto" style={{ maxWidth: '720px' }}>
            <ArticleHeader
              title={frontmatter.title}
              description={frontmatter.description}
              date={frontmatter.date}
              readingTime={readingTime}
              tags={frontmatter.tags ?? []}
              series={frontmatter.series}
              isToday={isToday}
              gradFrom={gradFrom}
              gradTo={gradTo}
            />
          </div>
        </header>

        {/* ═══ 아티클 본문 ═══ */}
        <main className="px-5 py-12">
          <div className="mx-auto" style={{ maxWidth: '720px' }}>
            <PaywallGate isToday={isToday}>
              {/* prose-roa: globals.css 정의된 기사 타이포그래피 */}
              <div className="prose-roa">
                <SafeMDXRemote
                  source={content}
                  components={getMDXComponents({})}
                />
              </div>
            </PaywallGate>
          </div>
        </main>

        {/* ═══ 하단 푸터 ═══ */}
        <footer
          className="px-5"
          style={{
            borderTop: '1px solid var(--roa-border-subtle)',
            paddingTop: '4rem',
            paddingBottom: 'max(4rem, calc(4rem + env(safe-area-inset-bottom)))',
          }}
        >
          <div className="mx-auto text-center" style={{ maxWidth: '480px' }}>
            <p
              className="text-xs tracking-[0.18em] uppercase font-medium mb-4"
              style={{ color: 'var(--roa-gold)' }}
            >
              ROA Finance
            </p>
            {isToday ? (
              <>
                <p className="text-sm mb-8" style={{ color: 'var(--roa-text-secondary)', lineHeight: 1.7 }}>
                  지나간 글은 멤버에게만 공개돼요.<br />
                  이메일 가입만 하면 모든 아카이브를 읽을 수 있어요.
                </p>
                <Link
                  href="/membership"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold min-h-[48px]"
                  style={{ backgroundColor: 'var(--roa-gold)', color: '#0A0A0A' }}
                >
                  무료로 멤버 가입하기
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm mb-8" style={{ color: 'var(--roa-text-secondary)', lineHeight: 1.7 }}>
                  더 많은 인사이트가 아카이브에 있어요.<br />
                  이메일 하나로 전체 아카이브를 제한 없이 읽을 수 있어요.
                </p>
                <Link
                  href="/membership"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold min-h-[48px]"
                  style={{ backgroundColor: 'var(--roa-gold)', color: '#0A0A0A' }}
                >
                  무료로 멤버 가입하기
                </Link>
                <p className="mt-3 text-xs" style={{ color: 'var(--roa-text-tertiary)' }}>
                  신용카드 불필요 · 언제든 탈퇴 가능
                </p>
              </>
            )}
          </div>
        </footer>
      </div>
    </>
  );
}
