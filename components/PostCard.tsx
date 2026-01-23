import type { PostMeta } from '@/lib/content';
import { formatViews } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getTagGradient } from '@/lib/design-system';

interface PostCardProps {
  post: PostMeta;
}

/**
 * PostCard Component
 * 토스 스타일의 블로그 포스트 카드
 * Design System 적용으로 인라인 스타일 제거
 */
export default function PostCard({ post }: PostCardProps) {
  return (
    <Card
      href={`/posts/${post.slug}`}
      className="h-full overflow-hidden flex flex-col"
      role="article"
      aria-label={post.title}
    >
      {/* Gradient Banner */}
      <div
        className="h-[180px] relative"
        style={{ background: getTagGradient(post.tags) }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Tags */}
        <div className="flex gap-2 mb-3">
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} tag={tag} size="sm">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
          {post.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          <time dateTime={post.date}>{post.date}</time>

          {post.readingTime && (
            <>
              <span className="text-gray-300">·</span>
              <span>{post.readingTime}</span>
            </>
          )}

          {formatViews(post.views) && (
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
                  className="flex-shrink-0"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {formatViews(post.views)}
              </span>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
