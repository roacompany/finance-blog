import Link from 'next/link';
import { getPostsBySeries } from '@/lib/content';

interface SeriesNavProps {
  series: string;
  currentSlug: string;
}

/**
 * SeriesNav Component
 * 토스 스타일의 시리즈 네비게이션
 * Design System 적용으로 인라인 스타일 제거
 */
export function SeriesNav({ series, currentSlug }: SeriesNavProps) {
  const seriesPosts = getPostsBySeries(series);

  if (seriesPosts.length <= 1) {
    return null;
  }

  const currentIndex = seriesPosts.findIndex((post) => post.slug === currentSlug);
  const prevPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null;

  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
      {/* Series Title */}
      <h3 className="flex items-center gap-2 mb-4 text-base font-bold text-gray-900">
        <span>📚</span>
        <span>{series}</span>
      </h3>

      {/* Series Posts List */}
      <ul className="flex flex-col gap-2 mb-5 list-none p-0">
        {seriesPosts.map((post, idx) => {
          const isCurrent = post.slug === currentSlug;
          const isCompleted = idx < currentIndex;

          return (
            <li key={post.slug}>
              <Link
                href={`/posts/${post.slug}`}
                className={`
                  flex items-start gap-2 px-3 py-2 rounded-lg text-sm leading-relaxed
                  transition-all duration-200 no-underline
                  ${
                    isCurrent
                      ? 'bg-white border-2 border-blue-600 text-blue-600 font-semibold'
                      : isCompleted
                      ? 'bg-gray-100 border border-transparent text-gray-700 hover:bg-gray-200'
                      : 'bg-transparent border border-transparent text-gray-500 hover:bg-gray-100'
                  }
                `}
              >
                <span className="min-w-[16px] flex-shrink-0">
                  {isCompleted && '✓'}
                  {isCurrent && '●'}
                  {!isCompleted && !isCurrent && `${idx + 1}.`}
                </span>
                <span className="flex-1">{post.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Previous/Next Navigation */}
      {(prevPost || nextPost) && (
        <div
          className={`
            grid gap-3 pt-4 border-t border-gray-200
            ${prevPost && nextPost ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}
          `}
        >
          {prevPost && (
            <Link
              href={`/posts/${prevPost.slug}`}
              className="flex flex-col gap-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl
                         no-underline transition-all duration-200
                         hover:border-blue-600 hover:bg-blue-50 group"
            >
              <span className="text-xs text-gray-500 font-medium group-hover:text-blue-600 transition-colors">
                ← 이전 글
              </span>
              <span className="text-sm text-gray-900 font-semibold line-clamp-2">
                {prevPost.title}
              </span>
            </Link>
          )}

          {nextPost && (
            <Link
              href={`/posts/${nextPost.slug}`}
              className={`
                flex flex-col gap-1 px-4 py-3 bg-blue-600 rounded-xl
                no-underline transition-all duration-200
                hover:bg-blue-700
                ${!prevPost ? 'text-left' : 'text-right'}
              `}
            >
              <span className="text-xs text-blue-100 font-medium">
                다음 글 →
              </span>
              <span className="text-sm text-white font-semibold line-clamp-2">
                {nextPost.title}
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
