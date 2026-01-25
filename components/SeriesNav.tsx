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
        <div className="pt-4 border-t border-gray-200 space-y-3">
          {/* Next Post - Primary CTA */}
          {nextPost && (
            <Link
              href={`/posts/${nextPost.slug}`}
              className="flex items-center justify-between gap-3 px-5 py-4 bg-blue-600 rounded-xl
                         no-underline transition-all duration-200
                         hover:bg-blue-700 hover:scale-[1.02] hover:shadow-lg
                         group"
            >
              <div className="flex-1">
                <div className="text-xs text-blue-100 font-medium mb-1">
                  다음 글
                </div>
                <div className="text-base text-white font-bold line-clamp-2">
                  {nextPost.title}
                </div>
              </div>
              <div className="flex-shrink-0 text-white opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </Link>
          )}

          {/* Previous Post - Secondary Link */}
          {prevPost && (
            <Link
              href={`/posts/${prevPost.slug}`}
              className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl
                         no-underline transition-all duration-200
                         hover:border-blue-600 hover:bg-blue-50 group"
            >
              <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 group-hover:-translate-x-1 transition-all">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17l-5-5m0 0l5-5m-5 5h12"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 font-medium group-hover:text-blue-600 transition-colors mb-1">
                  이전 글
                </div>
                <div className="text-sm text-gray-900 font-semibold line-clamp-2">
                  {prevPost.title}
                </div>
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
