'use client';

import { useEffect, useState } from 'react';
import AdminNav from '../components/AdminNav';
import AuthGuard from '../components/AuthGuard';

interface Settings {
  site_title: string;
  site_description: string;
  site_url: string;
  author_name: string;
  auto_post_enabled: string;
  auto_post_time: string;
  posts_per_page: string;
  [key: string]: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPassword: '',
    confirm: '',
  });
  const [passwordMsg, setPasswordMsg] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const res = await fetch('/api/admin/settings');
    if (res.ok) {
      setSettings(await res.json());
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
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
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
      setPasswordMsg('비밀번호가 변경되었습니다.');
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AdminNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">사이트 설정</h1>

        {/* Site Settings */}
        <form onSubmit={handleSave} className="space-y-6 mb-12">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
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

          {/* Auto Post Settings */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">자동 포스트 설정</h2>
            <p className="text-sm text-gray-500 -mt-1">Claude Code가 자동으로 포스트를 생성하는 설정입니다.</p>

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.auto_post_enabled === 'true'}
                  onChange={(e) => handleChange('auto_post_enabled', String(e.target.checked))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
              <span className="text-sm text-gray-700">자동 포스트 생성 활성화</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">생성 시간</label>
              <input
                type="time"
                value={settings.auto_post_time}
                onChange={(e) => handleChange('auto_post_time', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">매일 지정된 시간에 Claude Code가 포스트를 자동 생성합니다.</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            {saved && <span className="text-sm text-green-600">저장되었습니다</span>}
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
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">비밀번호 변경</h2>

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
