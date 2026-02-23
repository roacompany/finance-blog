import type { PostMeta } from '@/lib/content';
import { formatViews } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getTagGradient } from '@/lib/design-system';

interface HeroCardProps {
  post: PostMeta;
}

export default function HeroCard({ post }: HeroCardProps) {
  return (
    <Card
      href={`/posts/${post.slug}`}
      className="!p-0 overflow-hidden"
      role="article"
      aria-label={post.title}
    >
      <div className="flex flex-col md:flex-row md:min-h-[280px]">
        {/* Gradient Area */}
        <div
          className="h-[200px] md:h-auto md:w-[45%] relative flex-shrink-0"
          style={{ background: getTagGradient(post.tags) }}
        >
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 md:w-[55%] flex flex-col justify-center">
          {/* Tags */}
          <div className="flex gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} tag={tag} size="sm">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-3">
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
      </div>
    </Card>
  );
}
