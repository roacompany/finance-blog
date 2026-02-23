'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminNav from './components/AdminNav';
import AuthGuard from './components/AuthGuard';
import EmptyState from './components/EmptyState';
import { DashboardSkeleton } from './components/skeletons';
import { postStatusLabels } from '@/lib/admin-constants';
import { useToast } from '@/components/ui/Toast';

interface Stats {
  total: number;
  published: number;
  draft: number;
  pending_review: number;
  archived: number;
  auto_generated: number;
}

interface PostItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  date: string;
  auto_generated: number;
  created_at: string;
}

export default function AdminDashboard() {
  const toast = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentPosts, setRecentPosts] = useState<PostItem[]>([]);
  const [pendingPosts, setPendingPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [statsRes, recentRes, pendingRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/posts?limit=5'),
        fetch('/api/admin/posts?status=pending_review&limit=10'),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (recentRes.ok) {
        const data = await recentRes.json();
        setRecentPosts(data.posts);
      }
      if (pendingRes.ok) {
        const data = await pendingRes.json();
        setPendingPosts(data.posts);
      }
    } catch (error) {
      console.error('대시보드 데이터 로딩 실패:', error);
    }
    setLoading(false);
  }

  async function handlePublish(postId: string) {
    try {
      const res = await fetch(`/api/admin/posts/${postId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish' }),
      });

      if (res.ok) {
        toast.success('포스트가 발행되었습니다.');
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.error || '발행에 실패했습니다.');
      }
    } catch {
      toast.error('네트워크 오류가 발생했습니다.');
    }
  }

  return (
    <AuthGuard>
      <AdminNav />
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">대시보드</h1>
            <p className="text-sm text-gray-500 mt-1">블로그 운영 현황을 한눈에 확인하세요.</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <StatCard label="전체 포스트" value={stats.total} color="blue" />
              <StatCard label="발행됨" value={stats.published} color="green" />
              <StatCard label="승인 대기" value={stats.pending_review} color="yellow" />
              <StatCard label="임시저장" value={stats.draft} color="gray" />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Pending Review */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">발행 승인 대기</h2>
                <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                  {pendingPosts.length}건
                </span>
              </div>

              {pendingPosts.length === 0 ? (
                <EmptyState
                  icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  title="승인 대기 중인 포스트가 없습니다"
                  description="새 포스트를 작성하거나 백로그에서 자동 생성해보세요."
                />
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {pendingPosts.map((post) => (
                    <div key={post.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between p-3 rounded-xl bg-yellow-50 border border-yellow-100">
                      <div className="min-w-0 flex-1">
                        <Link href={`/admin/posts/${post.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-1">
                          {post.title}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {post.date}
                          {post.auto_generated ? ' · AI 자동 생성' : ''}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePublish(post.id)}
                        className="self-end sm:self-auto flex-shrink-0 sm:ml-3 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors active:scale-95"
                      >
                        발행 승인
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">최근 포스트</h2>
                <Link href="/admin/posts" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  전체 보기
                </Link>
              </div>

              {recentPosts.length === 0 ? (
                <EmptyState
                  icon="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  title="포스트가 없습니다"
                  description="첫 포스트를 작성해보세요!"
                  action={{ label: '새 포스트 작성', href: '/admin/posts/new' }}
                />
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="min-w-0 flex-1 mr-2">
                        <Link href={`/admin/posts/${post.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-1">
                          {post.title}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">{post.date}</p>
                      </div>
                      <span className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium ${postStatusLabels[post.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                        {postStatusLabels[post.status]?.label || post.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 sm:mt-6 bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">빠른 작업</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              <Link
                href="/admin/posts/new"
                className="flex items-center justify-center px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors active:scale-[0.98]"
              >
                새 포스트 작성
              </Link>
              <Link
                href="/admin/topics"
                className="flex items-center justify-center px-4 py-3 rounded-xl bg-indigo-100 text-indigo-800 text-sm font-semibold hover:bg-indigo-200 transition-colors active:scale-[0.98]"
              >
                백로그에서 선택
              </Link>
              <Link
                href="/admin/posts?status=pending_review"
                className="flex items-center justify-center px-4 py-3 rounded-xl bg-yellow-100 text-yellow-800 text-sm font-semibold hover:bg-yellow-200 transition-colors active:scale-[0.98]"
              >
                승인 대기 확인
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center justify-center px-4 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors active:scale-[0.98]"
              >
                사이트 설정
              </Link>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100',
    yellow: 'bg-yellow-50 border-yellow-100',
    gray: 'bg-gray-50 border-gray-100',
  };

  const textColors: Record<string, string> = {
    blue: 'text-blue-700',
    green: 'text-green-700',
    yellow: 'text-yellow-700',
    gray: 'text-gray-700',
  };

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${colors[color]}`}>
      <p className="text-xs sm:text-sm text-gray-500 font-medium">{label}</p>
      <p className={`text-2xl sm:text-3xl font-bold mt-1 ${textColors[color]}`}>{value}</p>
    </div>
  );
}
