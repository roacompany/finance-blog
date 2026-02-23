import Link from 'next/link';
import type { PostMeta } from '@/lib/content';
import { formatViews } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface HeroCardProps {
  post: PostMeta;
}

export default function HeroCard({ post }: HeroCardProps) {
  const ogUrl = `/api/og?title=${encodeURIComponent(post.title)}&tags=${post.tags.join(',')}`;

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex flex-col md:flex-row gap-6 md:gap-10"
      role="article"
      aria-label={post.title}
    >
      {/* Image — flex-[3] (60%), rounded-[10px], hover scale */}
      <div className="md:flex-[3] overflow-hidden rounded-[10px]">
        <img
          src={ogUrl}
          alt={post.title}
          className="w-full aspect-[4/3] md:aspect-auto md:h-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content — flex-[2] (40%) */}
      <div className="md:flex-[2] flex flex-col justify-center">
        {/* Tags */}
        <div className="flex gap-2">
          {post.tags.slice(0, 3).map((tag, i) => (
            <Badge key={`${tag}-${i}`} tag={tag} size="sm">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h2 className="mt-3 text-[26px] md:text-[35px] font-bold leading-[1.5] text-gray-900 line-clamp-2 group-hover:text-blue-500 transition-colors duration-200">
          {post.title}
        </h2>

        {/* Description */}
        <p className="mt-3 text-[17px] leading-[1.6] text-gray-600 line-clamp-4">
          {post.description}
        </p>

        {/* Metadata */}
        <div className="mt-4 flex items-center gap-2 text-[15px] text-gray-400">
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
      </div>
    </Link>
  );
}
