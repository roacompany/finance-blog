import Link from 'next/link';
import type { PostMeta } from '@/lib/content';
import { formatViews } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface PostCardProps {
  post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
  const ogUrl = `/api/og?title=${encodeURIComponent(post.title)}&tags=${post.tags.join(',')}`;

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block"
      role="article"
      aria-label={post.title}
    >
      {/* Thumbnail — OG image, aspect-[4/3], hover scale */}
      <div className="overflow-hidden rounded-[10px]">
        <img
          src={ogUrl}
          alt={post.title}
          className="w-full aspect-[4/3] object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Tags */}
      <div className="flex gap-2 mt-4">
        {post.tags.slice(0, 2).map((tag, i) => (
          <Badge key={`${tag}-${i}`} tag={tag} size="sm">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Title */}
      <h3 className="mt-2 text-[22px] font-bold leading-[1.5] text-gray-900 line-clamp-2 group-hover:text-blue-500 transition-colors duration-200">
        {post.title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-[17px] leading-[1.6] text-gray-600 line-clamp-2">
        {post.description}
      </p>

      {/* Metadata */}
      <div className="mt-3 flex items-center gap-2 text-[15px] text-gray-400">
        <time dateTime={post.date}>{post.date}</time>

        {post.readingTime && (
          <>
            <span>·</span>
            <span>{post.readingTime}</span>
          </>
        )}

        {formatViews(post.views) && (
          <>
            <span>·</span>
            <span>{formatViews(post.views)}</span>
          </>
        )}
      </div>
    </Link>
  );
}
