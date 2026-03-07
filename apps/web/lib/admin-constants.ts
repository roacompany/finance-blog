/** 어드민 패널 공통 상수 */

export const postStatusLabels: Record<string, { label: string; color: string }> = {
  published: { label: '발행됨', color: 'bg-green-100 text-green-700' },
  draft: { label: '임시저장', color: 'bg-gray-100 text-gray-700' },
  pending_review: { label: '승인 대기', color: 'bg-yellow-100 text-yellow-700' },
  archived: { label: '보관됨', color: 'bg-red-100 text-red-700' },
};

export const postStatusFilters = [
  { value: 'all', label: '전체' },
  { value: 'published', label: '발행됨' },
  { value: 'pending_review', label: '대기' },
  { value: 'draft', label: '임시저장' },
  { value: 'archived', label: '보관' },
] as const;

export const topicStatusLabels: Record<string, { label: string; color: string }> = {
  backlog: { label: '백로그', color: 'bg-blue-100 text-blue-700' },
  in_progress: { label: '작성중', color: 'bg-yellow-100 text-yellow-700' },
  completed: { label: '완료', color: 'bg-green-100 text-green-700' },
  skipped: { label: '건너뜀', color: 'bg-gray-100 text-gray-500' },
};

export const topicPriorityLabels: Record<number, { label: string; color: string }> = {
  0: { label: '보통', color: 'bg-gray-100 text-gray-600' },
  1: { label: '높음', color: 'bg-orange-100 text-orange-700' },
  2: { label: '긴급', color: 'bg-red-100 text-red-700' },
};
