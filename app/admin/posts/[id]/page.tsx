'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '../../components/AdminNav';
import AuthGuard from '../../components/AuthGuard';
import { PostEditSkeleton } from '../../components/skeletons';
import { postStatusLabels } from '@/lib/admin-constants';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '../../components/ConfirmProvider';

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
  const toast = useToast();
  const confirm = useConfirm();
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
        toast.success('저장되었습니다.');
      } else {
        const data = await res.json();
        toast.error(data.error || '저장에 실패했습니다.');
      }
    } catch {
      toast.error('서버 연결에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    const action = post?.status === 'published' ? 'unpublish' : 'publish';
    const confirmMsg = action === 'publish'
      ? '이 포스트를 발행하시겠습니까?'
      : '이 포스트를 비공개로 전환하시겠습니까?';

    const ok = await confirm({
      title: action === 'publish' ? '포스트 발행' : '비공개 전환',
      message: confirmMsg,
      confirmText: action === 'publish' ? '발행' : '비공개',
      variant: action === 'publish' ? 'default' : 'danger',
    });
    if (!ok) return;

    const res = await fetch(`/api/admin/posts/${id}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });

    if (res.ok) {
      toast.success(action === 'publish' ? '포스트가 발행되었습니다.' : '비공개로 전환되었습니다.');
      fetchPost();
    } else {
      toast.error('처리에 실패했습니다.');
    }
  }

  async function handleDelete() {
    const ok = await confirm({
      title: '포스트 삭제',
      message: '이 포스트를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
      confirmText: '삭제',
      variant: 'danger',
    });
    if (!ok) return;

    const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('포스트가 삭제되었습니다.');
      router.push('/admin/posts');
    } else {
      toast.error('삭제에 실패했습니다.');
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <AdminNav />
        <PostEditSkeleton />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          {/* Top row: back + badges */}
          <div className="flex items-center gap-2 mb-2">
            <Link href="/admin/posts" className="text-sm text-gray-500 hover:text-gray-700">
              &larr; 목록
            </Link>
            {post && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${postStatusLabels[post.status]?.color}`}>
                {postStatusLabels[post.status]?.label}
              </span>
            )}
            {post?.auto_generated ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700">
                AI 생성
              </span>
            ) : null}
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">포스트 편집</h1>

          {/* Action buttons - full width on mobile */}
          <div className="flex gap-2">
            {post?.status === 'published' ? (
              <button
                onClick={handlePublish}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-yellow-100 text-yellow-800 text-sm font-semibold hover:bg-yellow-200 transition-colors active:scale-[0.98]"
              >
                비공개 전환
              </button>
            ) : (
              <button
                onClick={handlePublish}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors active:scale-[0.98]"
              >
                발행 승인
              </button>
            )}
            <button
              onClick={handleDelete}
              className="px-4 py-2.5 rounded-xl text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors active:scale-[0.98]"
            >
              삭제
            </button>
          </div>
        </div>

        {/* Post Meta Info */}
        {post && (
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 text-xs text-gray-500">
            <span>생성: {new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
            <span>수정: {new Date(post.updated_at).toLocaleDateString('ko-KR')}</span>
            {post.published_at && <span>발행: {new Date(post.published_at).toLocaleDateString('ko-KR')}</span>}
            <span>조회수: {post.views}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-4">
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
                <span className="text-sm text-gray-400 hidden sm:inline">/posts/</span>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              본문 (MDX)
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={15}
              className="w-full px-3 sm:px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[300px] sm:min-h-[500px]"
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <Link
              href={`/posts/${form.slug}`}
              target="_blank"
              className="text-sm text-gray-500 hover:text-blue-600 text-center sm:text-left py-2"
            >
              프론트에서 보기
            </Link>
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-3 sm:py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors active:scale-[0.98]"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 sm:py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 active:scale-[0.98]"
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
