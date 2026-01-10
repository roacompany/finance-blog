import Link from 'next/link';
import { getRelatedPosts, type PostMeta } from '@/lib/content';

interface RelatedPostsProps {
  currentPost: PostMeta;
}

export function RelatedPosts({ currentPost }: RelatedPostsProps) {
  const relatedPosts = getRelatedPosts(currentPost, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        marginTop: '64px',
        paddingTop: '48px',
        borderTop: '1px solid #E5E8EB',
      }}
    >
      <h2
        style={{
          margin: 0,
          marginBottom: '24px',
          fontSize: '20px',
          fontWeight: 700,
          color: '#191F28',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>🔗</span>
        <span>이 글과 함께 읽으면 좋은 글</span>
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            style={{
              display: 'block',
              padding: '20px',
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E8EB',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <article>
              {/* Tag */}
              {post.tags.length > 0 && (
                <span
                  style={{
                    display: 'inline-block',
                    marginBottom: '8px',
                    padding: '4px 10px',
                    backgroundColor: '#EBF5FF',
                    color: '#3182F6',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '6px',
                  }}
                >
                  {post.tags[0]}
                </span>
              )}

              {/* Title */}
              <h3
                style={{
                  margin: 0,
                  marginBottom: '8px',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#191F28',
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {post.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#6B7280',
                  lineHeight: 1.6,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {post.description}
              </p>

              {/* Date */}
              <time
                dateTime={post.date}
                style={{
                  display: 'block',
                  marginTop: '12px',
                  fontSize: '13px',
                  color: '#9CA3AF',
                }}
              >
                {post.date}
              </time>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
