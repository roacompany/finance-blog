import Link from 'next/link';
import { getPostsBySeries, type PostMeta } from '@/lib/content';

interface SeriesNavProps {
  series: string;
  currentSlug: string;
}

export function SeriesNav({ series, currentSlug }: SeriesNavProps) {
  const seriesPosts = getPostsBySeries(series);

  if (seriesPosts.length <= 1) {
    return null; // 시리즈에 포스트가 1개 이하면 네비게이션 숨김
  }

  const currentIndex = seriesPosts.findIndex((post) => post.slug === currentSlug);
  const prevPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null;

  return (
    <div
      style={{
        marginTop: '48px',
        padding: '24px',
        backgroundColor: '#F9FAFB',
        borderRadius: '12px',
        border: '1px solid #E5E8EB',
      }}
    >
      {/* 시리즈 제목 */}
      <h3
        style={{
          margin: 0,
          marginBottom: '16px',
          fontSize: '16px',
          fontWeight: 700,
          color: '#191F28',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>📚</span>
        <span>{series}</span>
      </h3>

      {/* 시리즈 포스트 목록 */}
      <ul
        style={{
          margin: 0,
          marginBottom: '20px',
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {seriesPosts.map((post, idx) => {
          const isCurrent = post.slug === currentSlug;
          const isCompleted = idx < currentIndex;

          return (
            <li key={post.slug}>
              <Link
                href={`/posts/${post.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: isCurrent ? '#FFFFFF' : 'transparent',
                  border: isCurrent ? '1px solid #3182F6' : '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  color: isCurrent ? '#3182F6' : isCompleted ? '#4E5968' : '#8B95A1',
                  fontWeight: isCurrent ? 600 : 400,
                }}
              >
                <span style={{ minWidth: '16px' }}>
                  {isCompleted && '✅'}
                  {isCurrent && '📍'}
                  {!isCompleted && !isCurrent && `${idx + 1}.`}
                </span>
                <span>{post.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* 이전/다음 네비게이션 */}
      {(prevPost || nextPost) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: prevPost && nextPost ? '1fr 1fr' : '1fr',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid #E5E8EB',
          }}
        >
          {prevPost && (
            <Link
              href={`/posts/${prevPost.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E8EB',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '12px', color: '#8B95A1', fontWeight: 500 }}>
                ← 이전 글
              </span>
              <span
                style={{
                  fontSize: '14px',
                  color: '#191F28',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {prevPost.title}
              </span>
            </Link>
          )}

          {nextPost && (
            <Link
              href={`/posts/${nextPost.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E8EB',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                textAlign: nextPost && !prevPost ? 'left' : 'right',
              }}
            >
              <span style={{ fontSize: '12px', color: '#8B95A1', fontWeight: 500 }}>
                다음 글 →
              </span>
              <span
                style={{
                  fontSize: '14px',
                  color: '#191F28',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {nextPost.title}
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
