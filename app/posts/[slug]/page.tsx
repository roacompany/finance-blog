import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getPostSlugs, formatViews } from "@/lib/content";
import { useMDXComponents } from "./mdx-components";
import { SeriesNav } from "@/components/SeriesNav";
import { RelatedPosts } from "@/components/RelatedPosts";
import type { Metadata } from "next";

const BASE_URL = "https://www.roafinance.me";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const { frontmatter } = post;
  const url = `${BASE_URL}/posts/${frontmatter.slug}`;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.tags,
    authors: [{ name: "로아" }],
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url,
      siteName: "금융답게 바라보기, 로아의 시선",
      title: frontmatter.title,
      description: frontmatter.description,
      publishedTime: frontmatter.date,
      modifiedTime: frontmatter.base_date || frontmatter.date,
      tags: frontmatter.tags,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;

  // JSON-LD 구조화 데이터
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.base_date || frontmatter.date,
    author: {
      "@type": "Person",
      name: "로아",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "금융답게 바라보기, 로아의 시선",
      url: BASE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/posts/${frontmatter.slug}`,
    },
    keywords: frontmatter.tags.join(", "),
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header style={{ borderBottom: '1px solid #F2F4F6', padding: '16px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <Link
            href="/"
            style={{ fontSize: '14px', color: '#8B95A1', textDecoration: 'none' }}
          >
            ← 홈으로
          </Link>
        </div>
      </header>

      {/* Article */}
      <article style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Post Header */}
        <header style={{ marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid #F2F4F6' }}>
          {/* Series */}
          {frontmatter.series && (
            <p style={{ marginBottom: '8px', fontSize: '14px', color: '#3182F6', fontWeight: 500 }}>
              {frontmatter.series}
            </p>
          )}

          {/* Title */}
          <h1 style={{
            marginBottom: '16px',
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
            color: '#191F28',
          }}>
            {frontmatter.title}
          </h1>

          {/* Description */}
          <p style={{ marginBottom: '24px', fontSize: '17px', lineHeight: 1.6, color: '#4E5968' }}>
            {frontmatter.description}
          </p>

          {/* Meta: Date, Views & Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#8B95A1' }}>
              <time dateTime={frontmatter.date}>
                {frontmatter.date}
              </time>
              {formatViews(frontmatter.views) && (
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
                    {formatViews(frontmatter.views)}
                  </span>
                </>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: '#F2F4F6',
                    fontSize: '13px',
                    color: '#4E5968',
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Series Navigation */}
        {frontmatter.series && (
          <SeriesNav series={frontmatter.series} currentSlug={frontmatter.slug} />
        )}

        {/* Post Content */}
        <div>
          <MDXRemote
            source={content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
            components={useMDXComponents({})}
          />
        </div>

        {/* Related Posts */}
        <RelatedPosts currentPost={frontmatter} />
      </article>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #F2F4F6', padding: '32px 24px', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <Link
            href="/"
            style={{ fontSize: '14px', color: '#8B95A1', textDecoration: 'none' }}
          >
            ← 홈으로
          </Link>
        </div>
      </footer>
    </div>
  );
}
