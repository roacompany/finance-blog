'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '../../components/AdminNav';
import AuthGuard from '../../components/AuthGuard';

interface PostData {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  date: string;
  base_date: string;
  tags: string[];
  series: string;
  status: string;
  views: number;
  auto_generated: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<PostData | null>(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    date: '',
    base_date: '',
    tags: '',
    series: '',
    status: 'draft',
  });

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchPost() {
    const res = await fetch(`/api/admin/posts/${id}`);
    if (res.ok) {
      const data = await res.json();
      setPost(data);
      setForm({
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content,
        date: data.date,
        base_date: data.base_date || '',
        tags: data.tags.join(', '),
        series: data.series || '',
        status: data.status,
      });
    } else {
      router.push('/admin/posts');
    }
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPost(data);
        alert('저장되었습니다.');
      } else {
        const data = await res.json();
        alert(data.error || '저장에 실패했습니다.');
      }
    } catch {
      alert('서버 연결에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    const action = post?.status === 'published' ? 'unpublish' : 'publish';
    const confirmMsg = action === 'publish'
      ? '이 포스트를 발행하시겠습니까?'
      : '이 포스트를 비공개로 전환하시겠습니까?';

    if (!confirm(confirmMsg)) return;

    const res = await fetch(`/api/admin/posts/${id}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });

    if (res.ok) {
      fetchPost();
    }
  }

  async function handleDelete() {
    if (!confirm('이 포스트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

    const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/admin/posts');
    }
  }

  const statusLabels: Record<string, { label: string; color: string }> = {
    published: { label: '발행됨', color: 'bg-green-100 text-green-700' },
    draft: { label: '임시저장', color: 'bg-gray-100 text-gray-700' },
    pending_review: { label: '승인 대기', color: 'bg-yellow-100 text-yellow-700' },
    archived: { label: '보관됨', color: 'bg-red-100 text-red-700' },
  };

  if (loading) {
    return (
      <AuthGuard>
        <AdminNav />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin/posts" className="text-sm text-gray-500 hover:text-gray-700">
              ← 목록
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">포스트 편집</h1>
            {post && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabels[post.status]?.color}`}>
                {statusLabels[post.status]?.label}
              </span>
            )}
            {post?.auto_generated ? (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                AI 생성
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {post?.status === 'published' ? (
              <button
                onClick={handlePublish}
                className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-800 text-sm font-semibold hover:bg-yellow-200 transition-colors"
              >
                비공개 전환
              </button>
            ) : (
              <button
                onClick={handlePublish}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                발행 승인
              </button>
            )}
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              삭제
            </button>
          </div>
        </div>

        {/* Post Meta Info */}
        {post && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-wrap gap-4 text-xs text-gray-500">
            <span>생성: {new Date(post.created_at).toLocaleString('ko-KR')}</span>
            <span>수정: {new Date(post.updated_at).toLocaleString('ko-KR')}</span>
            {post.published_at && <span>발행: {new Date(post.published_at).toLocaleString('ko-KR')}</span>}
            <span>조회수: {post.views}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">슬러그 (URL)</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">/posts/</span>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Date & Base Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">발행일</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">기준일 (선택)</label>
                <input
                  type="date"
                  name="base_date"
                  value={form.base_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Tags & Series */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">태그 (쉼표 구분)</label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시리즈</label>
                <input
                  name="series"
                  value={form.series}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">임시저장</option>
                <option value="pending_review">승인 대기</option>
                <option value="published">발행</option>
                <option value="archived">보관</option>
              </select>
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              본문 (MDX)
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={30}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <Link
              href={`/posts/${form.slug}`}
              target="_blank"
              className="text-sm text-gray-500 hover:text-blue-600"
            >
              프론트에서 보기
            </Link>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}
