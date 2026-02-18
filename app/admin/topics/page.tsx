'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '../components/AdminNav';
import AuthGuard from '../components/AuthGuard';

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

const priorityLabels: Record<number, { label: string; color: string }> = {
  0: { label: '보통', color: 'bg-gray-100 text-gray-600' },
  1: { label: '높음', color: 'bg-orange-100 text-orange-700' },
  2: { label: '긴급', color: 'bg-red-100 text-red-700' },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  backlog: { label: '백로그', color: 'bg-blue-100 text-blue-700' },
  in_progress: { label: '작성중', color: 'bg-yellow-100 text-yellow-700' },
  completed: { label: '완료', color: 'bg-green-100 text-green-700' },
  skipped: { label: '건너뜀', color: 'bg-gray-100 text-gray-500' },
};

export default function TopicsPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [stats, setStats] = useState<TopicStats | null>(null);
  const [filter, setFilter] = useState('backlog');
  const [showAdd, setShowAdd] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState({
    title: '', description: '', tags: '', series: '', priority: 0,
  });

  useEffect(() => {
    fetchTopics();
  }, [filter]);

  async function fetchTopics() {
    const res = await fetch(`/api/admin/topics?status=${filter}&stats=true`);
    if (res.ok) {
      const data = await res.json();
      setTopics(data.topics);
      setStats(data.stats);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
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
      fetchTopics();
    }
  }

  async function handleGenerate(topicId: string, mode: 'draft' | 'auto') {
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
          alert('자동 생성이 완료되었습니다. 승인 대기 목록을 확인하세요.');
          fetchTopics();
        }
      } else {
        const err = await res.json();
        alert(err.error || '생성에 실패했습니다.');
      }
    } finally {
      setGenerating(null);
    }
  }

  async function handleStatusChange(topicId: string, status: string) {
    await fetch(`/api/admin/topics/${topicId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchTopics();
  }

  async function handleDelete(topicId: string) {
    if (!confirm('이 토픽을 삭제하시겠습니까?')) return;
    await fetch(`/api/admin/topics/${topicId}`, { method: 'DELETE' });
    fetchTopics();
  }

  return (
    <AuthGuard>
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20 sm:pb-8">
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
              {s === 'all' ? '전체' : statusLabels[s]?.label || s}
            </button>
          ))}
        </div>

        {/* Topic List */}
        <div className="space-y-3">
          {topics.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              해당 상태의 토픽이 없습니다.
            </div>
          ) : (
            topics.map(topic => (
              <div key={topic.id} className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  {/* Topic Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-bold text-gray-900">{topic.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${priorityLabels[topic.priority]?.color}`}>
                        {priorityLabels[topic.priority]?.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusLabels[topic.status]?.color}`}>
                        {statusLabels[topic.status]?.label}
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
                        disabled={generating === topic.id}
                        className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
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
    </AuthGuard>
  );
}
