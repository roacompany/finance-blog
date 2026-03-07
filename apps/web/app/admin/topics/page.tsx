'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '../components/AdminNav';
import AuthGuard from '../components/AuthGuard';
import EmptyState from '../components/EmptyState';
import { TopicsSkeleton } from '../components/skeletons';
import { topicStatusLabels, topicPriorityLabels } from '@/lib/admin-constants';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '../components/ConfirmProvider';

interface Topic {
  id: string;
  title: string;
  description: string;
  tags: string[];
  series: string;
  priority: number;
  status: string;
  notes: string;
  created_at: string;
}

interface TopicStats {
  total: number;
  backlog: number;
  in_progress: number;
  completed: number;
  skipped: number;
}

export default function TopicsPage() {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [stats, setStats] = useState<TopicStats | null>(null);
  const [filter, setFilter] = useState('backlog');
  const [showAdd, setShowAdd] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [newTopic, setNewTopic] = useState({
    title: '', description: '', tags: '', series: '', priority: 0,
  });

  useEffect(() => {
    fetchTopics();
    checkAiStatus();
  }, [filter]);

  async function checkAiStatus() {
    try {
      const res = await fetch('/api/admin/ai-status');
      if (res.ok) {
        const data = await res.json();
        setAiConfigured(data.configured);
      }
    } catch {
      // AI status check is non-critical
    }
  }

  async function fetchTopics() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/topics?status=${filter}&stats=true`);
      if (res.ok) {
        const data = await res.json();
        setTopics(data.topics);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('토픽 목록 로딩 실패:', error);
    }
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTopic,
          tags: newTopic.tags.split(',').map(t => t.trim()).filter(Boolean),
          priority: Number(newTopic.priority),
        }),
      });
      if (res.ok) {
        setShowAdd(false);
        setNewTopic({ title: '', description: '', tags: '', series: '', priority: 0 });
        toast.success('토픽이 추가되었습니다.');
        fetchTopics();
      } else {
        const err = await res.json();
        toast.error(err.error || '토픽 추가에 실패했습니다.');
      }
    } catch {
      toast.error('네트워크 오류가 발생했습니다.');
    }
  }

  async function handleGenerate(topicId: string, mode: 'draft' | 'auto') {
    if (mode === 'auto' && aiConfigured === false) {
      toast.info('AI API가 설정되지 않았습니다. 설정 페이지에서 환경변수를 확인하세요.');
      return;
    }
    setGenerating(topicId);
    try {
      const res = await fetch(`/api/admin/topics/${topicId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });

      if (res.ok) {
        const data = await res.json();
        if (mode === 'draft') {
          router.push(`/admin/posts/${data.post.id}`);
        } else {
          toast.success('자동 생성이 완료되었습니다. 승인 대기 목록을 확인하세요.');
          fetchTopics();
        }
      } else {
        const err = await res.json();
        if (err.needsConfig) {
          toast.info('AI API가 설정되지 않았습니다. 설정 페이지에서 환경변수를 확인하세요.');
        } else {
          toast.error(err.error || '생성에 실패했습니다.');
        }
      }
    } finally {
      setGenerating(null);
    }
  }

  async function handleStatusChange(topicId: string, status: string) {
    try {
      const res = await fetch(`/api/admin/topics/${topicId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || '상태 변경에 실패했습니다.');
      } else {
        toast.success('상태가 변경되었습니다.');
      }
      fetchTopics();
    } catch {
      toast.error('네트워크 오류가 발생했습니다.');
    }
  }

  async function handleDelete(topicId: string) {
    const ok = await confirm({
      title: '토픽 삭제',
      message: '이 토픽을 삭제하시겠습니까?',
      confirmText: '삭제',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/topics/${topicId}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || '삭제에 실패했습니다.');
      } else {
        toast.success('토픽이 삭제되었습니다.');
      }
      fetchTopics();
    } catch {
      toast.error('네트워크 오류가 발생했습니다.');
    }
  }

  return (
    <AuthGuard>
      <AdminNav />
      {loading && !stats ? (
        <TopicsSkeleton />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">포스트 백로그</h1>
              <p className="text-sm text-gray-500 mt-1">작성할 토픽을 관리하고, 자동 또는 수동으로 포스트를 생성하세요.</p>
            </div>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors active:scale-95"
            >
              {showAdd ? '취소' : '토픽 추가'}
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <p className="text-xs text-gray-500 font-medium">백로그</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">{stats.backlog}</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4">
                <p className="text-xs text-gray-500 font-medium">작성중</p>
                <p className="text-2xl font-bold text-yellow-700 mt-1">{stats.in_progress}</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                <p className="text-xs text-gray-500 font-medium">완료</p>
                <p className="text-2xl font-bold text-green-700 mt-1">{stats.completed}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                <p className="text-xs text-gray-500 font-medium">전체</p>
                <p className="text-2xl font-bold text-gray-700 mt-1">{stats.total}</p>
              </div>
            </div>
          )}

          {/* Add Form */}
          {showAdd && (
            <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6 space-y-3">
              <input
                value={newTopic.title}
                onChange={e => setNewTopic(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="토픽 제목 (예: 2026 기준금리 전망)"
                required
              />
              <textarea
                value={newTopic.description}
                onChange={e => setNewTopic(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
                placeholder="간단한 설명 (선택)"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  value={newTopic.tags}
                  onChange={e => setNewTopic(prev => ({ ...prev, tags: e.target.value }))}
                  className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="태그 (쉼표 구분)"
                />
                <input
                  value={newTopic.series}
                  onChange={e => setNewTopic(prev => ({ ...prev, series: e.target.value }))}
                  className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="시리즈 (선택)"
                />
                <select
                  value={newTopic.priority}
                  onChange={e => setNewTopic(prev => ({ ...prev, priority: Number(e.target.value) }))}
                  className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>보통 우선순위</option>
                  <option value={1}>높은 우선순위</option>
                  <option value={2}>긴급</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                추가
              </button>
            </form>
          )}

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {(['backlog', 'in_progress', 'completed', 'skipped', 'all'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  filter === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s === 'all' ? '전체' : topicStatusLabels[s]?.label || s}
              </button>
            ))}
          </div>

          {/* Topic List */}
          <div className="space-y-3">
            {topics.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200">
                <EmptyState
                  icon="M8.25 6.75h12M8.25 12h12M8.25 17.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  title="해당 상태의 토픽이 없습니다"
                  description="새 토픽을 추가하여 백로그를 채워보세요."
                  action={filter !== 'backlog' ? undefined : { label: '토픽 추가', onClick: () => setShowAdd(true) }}
                />
              </div>
            ) : (
              topics.map(topic => (
                <div key={topic.id} className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    {/* Topic Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-sm font-bold text-gray-900">{topic.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${topicPriorityLabels[topic.priority]?.color}`}>
                          {topicPriorityLabels[topic.priority]?.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${topicStatusLabels[topic.status]?.color}`}>
                          {topicStatusLabels[topic.status]?.label}
                        </span>
                      </div>
                      {topic.description && (
                        <p className="text-xs text-gray-500 mb-2">{topic.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {topic.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] text-gray-600">
                            {tag}
                          </span>
                        ))}
                        {topic.series && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[10px] text-blue-600">
                            {topic.series}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {topic.status === 'backlog' && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleGenerate(topic.id, 'draft')}
                          disabled={generating === topic.id}
                          className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                          {generating === topic.id ? '생성중...' : '수동 작성'}
                        </button>
                        <button
                          onClick={() => handleGenerate(topic.id, 'auto')}
                          disabled={generating === topic.id || aiConfigured === false}
                          className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                          title={aiConfigured === false ? 'AI API 미설정' : undefined}
                        >
                          {generating === topic.id ? '생성중...' : '자동 생성'}
                        </button>
                        <button
                          onClick={() => handleStatusChange(topic.id, 'skipped')}
                          className="px-3 py-2 rounded-xl text-gray-400 text-xs hover:text-red-500 transition-colors"
                          title="건너뛰기"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    {topic.status === 'skipped' && (
                      <button
                        onClick={() => handleStatusChange(topic.id, 'backlog')}
                        className="px-3 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
                      >
                        복원
                      </button>
                    )}
                    {topic.status !== 'backlog' && (
                      <button
                        onClick={() => handleDelete(topic.id)}
                        className="px-3 py-2 rounded-xl text-gray-400 text-xs hover:text-red-500 transition-colors"
                        title="삭제"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
