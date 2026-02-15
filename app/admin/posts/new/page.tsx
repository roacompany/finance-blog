'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '../../components/AdminNav';
import AuthGuard from '../../components/AuthGuard';

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    base_date: '',
    tags: '',
    series: '',
    status: 'draft' as string,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setForm((prev) => ({ ...prev, slug }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/posts/${data.id}`);
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

  return (
    <AuthGuard>
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">새 포스트 작성</h1>
        </div>

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
                placeholder="포스트 제목"
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
                  placeholder="my-post-slug"
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
                placeholder="SEO 설명 (2-3문장)"
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
                  placeholder="금리, 투자, 대출"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시리즈</label>
                <input
                  name="series"
                  value={form.series}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Series 01. 금리·통화정책"
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
              placeholder="## 본문 내용을 작성하세요&#10;&#10;MDX 마크다운 형식으로 작성합니다."
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
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
        </form>
      </div>
    </AuthGuard>
  );
}
