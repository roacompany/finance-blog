'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AdminNav from '../components/AdminNav';
import AuthGuard from '../components/AuthGuard';

interface PostItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: string;
  date: string;
  tags: string[];
  series: string;
  auto_generated: number;
  views: number;
  created_at: string;
  updated_at: string;
}

const statusFilters = [
  { value: 'all', label: '전체' },
  { value: 'published', label: '발행됨' },
  { value: 'pending_review', label: '대기' },
  { value: 'draft', label: '임시저장' },
  { value: 'archived', label: '보관' },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  published: { label: '발행됨', color: 'bg-green-100 text-green-700' },
  draft: { label: '임시저장', color: 'bg-gray-100 text-gray-700' },
  pending_review: { label: '승인 대기', color: 'bg-yellow-100 text-yellow-700' },
  archived: { label: '보관됨', color: 'bg-red-100 text-red-700' },
};

export default function AdminPostsPage() {
  return (
    <Suspense fallback={
      <AuthGuard>
        <AdminNav />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AuthGuard>
    }>
      <AdminPostsContent />
    </Suspense>
  );
}

function AdminPostsContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, page]);

  async function fetchPosts() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search) params.set('search', search);
      params.set('page', String(page));
      params.set('limit', '15');

      const res = await fetch(`/api/admin/posts?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('포스트 목록 로딩 실패:', error);
    }
    setLoading(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  }

  async function handlePublish(postId: string) {
    try {
      const res = await fetch(`/api/admin/posts/${postId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish' }),
      });
      if (res.ok) {
        fetchPosts();
      } else {
        const err = await res.json();
        alert(err.error || '발행에 실패했습니다.');
      }
    } catch {
      alert('네트워크 오류가 발생했습니다.');
    }
  }

  async function handleDelete(postId: string, title: string) {
    if (!confirm(`"${title}" 포스트를 삭제하시겠습니까?`)) return;

    try {
      const res = await fetch(`/api/admin/posts/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPosts();
      } else {
        const err = await res.json();
        alert(err.error || '삭제에 실패했습니다.');
      }
    } catch {
      alert('네트워크 오류가 발생했습니다.');
    }
  }

  return (
    <AuthGuard>
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">포스트 관리</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">총 {total}개의 포스트</p>
          </div>
          <Link
            href="/admin/posts/new"
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors active:scale-95"
          >
            새 포스트
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col gap-3">
            {/* Status Filter - scrollable on mobile */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => { setStatusFilter(filter.value); setPage(1); }}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === filter.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="검색..."
                className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="flex-shrink-0 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                검색
              </button>
            </form>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">로딩 중...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-400">포스트가 없습니다.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-100">
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">제목</th>
                      <th className="px-6 py-3">시리즈</th>
                      <th className="px-6 py-3">상태</th>
                      <th className="px-6 py-3">날짜</th>
                      <th className="px-6 py-3 text-right">작업</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <Link href={`/admin/posts/${post.id}`} className="block">
                            <p className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate max-w-xs">
                              {post.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                              /{post.slug}
                              {post.auto_generated ? ' · AI 생성' : ''}
                            </p>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-gray-500">{post.series || '-'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusLabels[post.status]?.color || 'bg-gray-100'}`}>
                            {statusLabels[post.status]?.label || post.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-gray-500">{post.date}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {post.status === 'pending_review' && (
                              <button
                                onClick={() => handlePublish(post.id)}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
                              >
                                발행
                              </button>
                            )}
                            <Link
                              href={`/admin/posts/${post.id}`}
                              className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors"
                            >
                              편집
                            </Link>
                            <button
                              onClick={() => handleDelete(post.id, post.title)}
                              className="px-3 py-1.5 rounded-lg text-red-500 text-xs font-medium hover:bg-red-50 transition-colors"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List */}
              <div className="md:hidden divide-y divide-gray-100">
                {posts.map((post) => (
                  <div key={post.id} className="p-4 active:bg-gray-50">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Link href={`/admin/posts/${post.id}`} className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {post.title}
                        </p>
                      </Link>
                      <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusLabels[post.status]?.color || 'bg-gray-100'}`}>
                        {statusLabels[post.status]?.label || post.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <span>{post.date}</span>
                      {post.series && (
                        <>
                          <span>·</span>
                          <span className="truncate">{post.series}</span>
                        </>
                      )}
                      {post.auto_generated ? (
                        <>
                          <span>·</span>
                          <span className="text-purple-500">AI</span>
                        </>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      {post.status === 'pending_review' && (
                        <button
                          onClick={() => handlePublish(post.id)}
                          className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all"
                        >
                          발행 승인
                        </button>
                      )}
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold text-center hover:bg-gray-200 active:scale-[0.98] transition-all"
                      >
                        편집
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="py-2.5 px-3 rounded-xl text-red-500 text-xs font-semibold hover:bg-red-50 active:scale-[0.98] transition-all"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-4 border-t border-gray-100">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 active:scale-95 transition-all"
              >
                이전
              </button>
              <span className="text-sm text-gray-500">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 active:scale-95 transition-all"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
