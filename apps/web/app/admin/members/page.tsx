'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminNav from '../components/AdminNav';
import AuthGuard from '../components/AuthGuard';
import { useToast } from '@/components/ui/Toast';

interface Member {
  id: string;
  email: string;
  active: boolean;
  source: string;
  created_at: string;
}

interface MembersResponse {
  members: Member[];
  total: number;
  page: number;
  totalPages: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function MembersPage() {
  const toast = useToast();
  const [data, setData] = useState<MembersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    const res = await fetch(`/api/admin/members?${params}`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  async function handleToggle(member: Member) {
    const newActive = !member.active;
    // 낙관적 업데이트
    setData(prev => prev ? {
      ...prev,
      members: prev.members.map(m => m.id === member.id ? { ...m, active: newActive } : m),
    } : null);

    const res = await fetch(`/api/admin/members/${member.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: newActive }),
    });

    if (!res.ok) {
      // 롤백
      setData(prev => prev ? {
        ...prev,
        members: prev.members.map(m => m.id === member.id ? { ...m, active: member.active } : m),
      } : null);
      toast.error('상태 변경에 실패했습니다.');
    }
  }

  async function handleDelete(member: Member) {
    if (!confirm(`${member.email} 멤버를 삭제하시겠습니까?`)) return;

    const res = await fetch(`/api/admin/members/${member.id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('멤버가 삭제되었습니다.');
      fetchMembers();
    } else {
      toast.error('삭제에 실패했습니다.');
    }
  }

  return (
    <AuthGuard>
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">멤버 관리</h1>
            {data && (
              <p className="text-sm text-gray-500 mt-0.5">
                총 <span className="font-semibold text-gray-700">{data.total.toLocaleString()}</span>명
              </p>
            )}
          </div>

          {/* 검색 */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="email"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="이메일 검색"
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-56"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
            >
              검색
            </button>
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}
                className="px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                초기화
              </button>
            )}
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-4 bg-gray-100 animate-pulse rounded-full flex-1 max-w-xs" />
                  <div className="h-4 bg-gray-100 animate-pulse rounded-full w-16" />
                  <div className="h-4 bg-gray-100 animate-pulse rounded-full w-20" />
                </div>
              ))}
            </div>
          ) : !data || data.members.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">
                {search ? `"${search}" 검색 결과가 없습니다.` : '아직 멤버가 없습니다.'}
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-[1fr_80px_100px_80px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">이메일</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">가입일</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">경로</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">상태</span>
              </div>

              <div className="divide-y divide-gray-100">
                {data.members.map(member => (
                  <div key={member.id} className="flex flex-col sm:grid sm:grid-cols-[1fr_80px_100px_80px] sm:items-center gap-2 sm:gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group">
                    {/* Email */}
                    <span className="text-sm font-medium text-gray-900 truncate">{member.email}</span>

                    {/* Date */}
                    <span className="text-xs text-gray-400">{formatDate(member.created_at)}</span>

                    {/* Source */}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 w-fit">
                      {member.source}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggle(member)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                          member.active ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                        title={member.active ? '비활성화' : '활성화'}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                          member.active ? 'translate-x-4.5' : 'translate-x-0.5'
                        }`} />
                      </button>
                      <button
                        onClick={() => handleDelete(member)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-300 hover:text-red-500"
                        title="삭제"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 3.5h10M5.5 3.5V2.5a1 1 0 011-1h1a1 1 0 011 1v1M6 6.5v4M8 6.5v4M3 3.5l.5 8a1 1 0 001 .9h5a1 1 0 001-.9l.5-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500">
              {page} / {data.totalPages} 페이지
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                이전
              </button>
              <button
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
