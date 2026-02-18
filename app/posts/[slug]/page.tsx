import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPostSlugs, formatViews } from "@/lib/content";
import { useMDXComponents } from "./mdx-components";
import { SafeMDXRemote } from "@/components/SafeMDXRemote";
import { SeriesNav } from "@/components/SeriesNav";
import { RelatedPosts } from "@/components/RelatedPosts";
import { ReadingProgress } from "@/components/ReadingProgress";
import { TableOfContents } from "@/components/TableOfContents";
import { ShareButtons } from "@/components/ShareButtons";
import { getContainerClass } from "@/lib/design-system";
import type { Metadata } from "next";

const BASE_URL = "https://www.roafinance.me";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    return { title: "Error" };
  }

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

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    console.error(`[PostPage] Failed to load post "${slug}":`, error);
    notFound();
  }

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

  const postUrl = `${BASE_URL}/posts/${frontmatter.slug}`;

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Reading Progress Bar */}
      <ReadingProgress />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-100 py-4 px-6">
          <div className="max-w-[700px] mx-auto">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors no-underline"
            >
              ← 홈으로
            </Link>
          </div>
        </header>

        {/* Main Content Container */}
        <div className="relative">
          <div className={getContainerClass() + " py-12"}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
              {/* Left Column: Article Content */}
              <div className="min-w-0">
                <article className="max-w-[700px] mx-auto">
                  {/* Post Header */}
                  <header className="mb-10 pb-8 border-b border-gray-100">
                    {/* Series */}
                    {frontmatter.series && (
                      <p className="mb-2 text-sm text-blue-600 font-medium">
                        {frontmatter.series}
                      </p>
                    )}

                    {/* Title */}
                    <h1 className="mb-4 text-3xl md:text-4xl font-bold leading-tight tracking-tight text-gray-900">
                      {frontmatter.title}
                    </h1>

                    {/* Description */}
                    <p className="mb-6 text-base md:text-lg leading-relaxed text-gray-600">
                      {frontmatter.description}
                    </p>

                    {/* Meta: Date, Views & Tags */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <time dateTime={frontmatter.date}>
                          {frontmatter.date}
                        </time>
                        {formatViews(frontmatter.views) && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span className="inline-flex items-center gap-1">
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
                      <div className="flex flex-wrap gap-2">
                        {frontmatter.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-700 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </header>

                  {/* Table of Contents (Mobile) */}
                  <TableOfContents />

                  {/* Series Navigation */}
                  {frontmatter.series && (
                    <SeriesNav series={frontmatter.series} currentSlug={frontmatter.slug} />
                  )}

                  {/* Post Content */}
                  <div className="prose prose-lg max-w-none">
                    <SafeMDXRemote
                      source={content}
                      components={useMDXComponents({})}
                    />
                  </div>

                  {/* Share Buttons */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <ShareButtons title={frontmatter.title} url={postUrl} />
                  </div>

                  {/* Related Posts */}
                  <RelatedPosts currentPost={frontmatter} />
                </article>
              </div>

              {/* Right Column: Table of Contents (Desktop) */}
              <aside className="hidden lg:block">
                <TableOfContents />
              </aside>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-8 px-6 bg-gray-50">
          <div className="max-w-[700px] mx-auto text-center">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors no-underline"
            >
              ← 홈으로
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}
