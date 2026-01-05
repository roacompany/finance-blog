import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getPostSlugs } from "@/lib/content";
import { useMDXComponents } from "./mdx-components";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
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

          {/* Meta: Date & Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
            <time style={{ fontSize: '14px', color: '#8B95A1' }} dateTime={frontmatter.date}>
              {frontmatter.date}
            </time>
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
