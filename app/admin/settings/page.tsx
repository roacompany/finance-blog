'use client';

import { useEffect, useState } from 'react';
import AdminNav from '../components/AdminNav';
import AuthGuard from '../components/AuthGuard';
import { SettingsSkeleton } from '../components/skeletons';
import { useToast } from '@/components/ui/Toast';

interface Settings {
  site_title: string;
  site_description: string;
  site_url: string;
  author_name: string;
  posts_per_page: string;
  [key: string]: string;
}

interface AiStatus {
  configured: boolean;
  provider: string | null;
}

export default function AdminSettingsPage() {
  const toast = useToast();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPassword: '',
    confirm: '',
  });
  const [passwordMsg, setPasswordMsg] = useState('');

  useEffect(() => {
    fetchSettings();
    fetchAiStatus();
  }, []);

  async function fetchSettings() {
    const res = await fetch('/api/admin/settings');
    if (res.ok) {
      setSettings(await res.json());
    }
  }

  async function fetchAiStatus() {
    try {
      const res = await fetch('/api/admin/ai-status');
      if (res.ok) {
        setAiStatus(await res.json());
      }
    } catch {
      // non-critical
    }
  }

  function handleChange(key: string, value: string) {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);

    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    if (res.ok) {
      toast.success('설정이 저장되었습니다.');
    } else {
      toast.error('설정 저장에 실패했습니다.');
    }
    setSaving(false);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg('');

    if (passwordForm.newPassword !== passwordForm.confirm) {
      setPasswordMsg('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMsg('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    const res = await fetch('/api/admin/auth/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: passwordForm.current,
        newPassword: passwordForm.newPassword,
      }),
    });

    if (res.ok) {
      toast.success('비밀번호가 변경되었습니다.');
      setPasswordMsg('');
      setPasswordForm({ current: '', newPassword: '', confirm: '' });
    } else {
      const data = await res.json();
      setPasswordMsg(data.error || '비밀번호 변경에 실패했습니다.');
    }
  }

  if (!settings) {
    return (
      <AuthGuard>
        <AdminNav />
        <SettingsSkeleton />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AdminNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">사이트 설정</h1>

        {/* Site Settings */}
        <form onSubmit={handleSave} className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">기본 정보</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">사이트 제목</label>
              <input
                value={settings.site_title}
                onChange={(e) => handleChange('site_title', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">사이트 설명</label>
              <input
                value={settings.site_description}
                onChange={(e) => handleChange('site_description', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">사이트 URL</label>
              <input
                value={settings.site_url}
                onChange={(e) => handleChange('site_url', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">작성자 이름</label>
              <input
                value={settings.author_name}
                onChange={(e) => handleChange('author_name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">페이지당 포스트 수</label>
              <input
                type="number"
                value={settings.posts_per_page}
                onChange={(e) => handleChange('posts_per_page', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="50"
              />
            </div>
          </div>

          {/* AI Connection Status */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">AI 콘텐츠 생성</h2>
            <p className="text-sm text-gray-500 -mt-1">백로그 토픽에서 자동으로 포스트를 생성할 때 사용됩니다.</p>

            {aiStatus ? (
              aiStatus.configured ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-sm text-green-700 font-medium">
                    {aiStatus.provider} API 연결됨
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0" />
                    <span className="text-sm text-yellow-700 font-medium">AI API 미설정</span>
                  </div>
                  <p className="text-xs text-yellow-600 ml-5">
                    자동 콘텐츠 생성을 사용하려면 환경변수를 설정하세요:<br />
                    <code className="font-mono bg-yellow-100 px-1 rounded">AI_PROVIDER=claude|openai</code><br />
                    <code className="font-mono bg-yellow-100 px-1 rounded">AI_API_KEY=your-api-key</code>
                  </p>
                </div>
              )
            ) : (
              <div className="h-12 animate-pulse bg-gray-100 rounded-xl" />
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? '저장 중...' : '설정 저장'}
            </button>
          </div>
        </form>

        {/* Password Change */}
        <form onSubmit={handlePasswordChange} className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">비밀번호 변경</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {passwordMsg && (
              <p className={`text-sm ${passwordMsg.includes('변경되었습니다') ? 'text-green-600' : 'text-red-600'}`}>
                {passwordMsg}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gray-800 text-white text-sm font-semibold hover:bg-gray-900 transition-colors"
            >
              비밀번호 변경
            </button>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}
