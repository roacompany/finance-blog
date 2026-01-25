import { getRelatedPosts, type PostMeta } from '@/lib/content';
import PostCard from '@/components/PostCard';

interface RelatedPostsProps {
  currentPost: PostMeta;
}

/**
 * RelatedPosts Component
 * 관련 포스트 추천 섹션
 * PostCard 재사용으로 디자인 일관성 확보
 */
export function RelatedPosts({ currentPost }: RelatedPostsProps) {
  const relatedPosts = getRelatedPosts(currentPost, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 -mx-6 md:-mx-8 px-6 md:px-8 py-12 bg-blue-50 rounded-2xl">
      <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-6">
        <span>🔗</span>
        <span>이 글과 함께 읽으면 좋은 글</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
