'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminNav from '../components/AdminNav';
import AuthGuard from '../components/AuthGuard';
import { COMPONENT_REGISTRY, REGISTRY_MAP, type PageComponent, type ComponentConfigField } from '@/lib/component-registry';

/* ─── helpers ─── */
function labelFor(key: string) {
  return REGISTRY_MAP[key]?.label ?? key;
}

function descriptionFor(key: string) {
  return REGISTRY_MAP[key]?.description ?? '';
}

function schemaFor(key: string): ComponentConfigField[] {
  return REGISTRY_MAP[key]?.configSchema ?? [];
}

/* ─── Config Editor Modal ─── */
function ConfigModal({
  component,
  onSave,
  onClose,
}: {
  component: PageComponent;
  onSave: (id: string, config: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Record<string, unknown>>(
    component.config as unknown as Record<string, unknown>
  );
  const schema = schemaFor(component.component_key);

  function handleChange(key: string, value: unknown) {
    setDraft(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">{labelFor(component.component_key)} 설정</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {schema.map(field => (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{field.label}</label>
              {field.type === 'boolean' ? (
                <button
                  onClick={() => handleChange(field.key, !draft[field.key])}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    draft[field.key] ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    draft[field.key] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={String(draft[field.key] ?? '')}
                  onChange={e => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              ) : field.type === 'color' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={String(draft[field.key] ?? '#000000')}
                    onChange={e => handleChange(field.key, e.target.value)}
                    className="h-8 w-10 rounded cursor-pointer border border-gray-200"
                  />
                  <span className="text-xs text-gray-500">{String(draft[field.key] ?? '')}</span>
                </div>
              ) : field.type === 'number' ? (
                <input
                  type="number"
                  value={Number(draft[field.key] ?? 0)}
                  onChange={e => handleChange(field.key, Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <input
                  type="text"
                  value={String(draft[field.key] ?? '')}
                  onChange={e => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}

          {schema.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">설정 가능한 항목이 없어요.</p>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => { onSave(component.id, draft); onClose(); }}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Component Row ─── */
function ComponentRow({
  component,
  index,
  total,
  onToggle,
  onMoveUp,
  onMoveDown,
  onEdit,
}: {
  component: PageComponent;
  index: number;
  total: number;
  onToggle: (id: string, enabled: boolean) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onEdit: (component: PageComponent) => void;
}) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
      component.enabled
        ? 'bg-white border-gray-200'
        : 'bg-gray-50 border-gray-100 opacity-60'
    }`}>
      {/* 순서 이동 */}
      <div className="flex flex-col gap-0.5">
        <button
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 9.5l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={() => onMoveDown(index)}
          disabled={index === total - 1}
          className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 4.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* 순서 숫자 */}
      <span className="w-5 text-center text-xs font-mono text-gray-300">{index + 1}</span>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{labelFor(component.component_key)}</p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{descriptionFor(component.component_key)}</p>
      </div>

      {/* 액션 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {schemaFor(component.component_key).length > 0 && (
          <button
            onClick={() => onEdit(component)}
            className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            편집
          </button>
        )}
        <button
          onClick={() => onToggle(component.id, !component.enabled)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
            component.enabled ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
            component.enabled ? 'translate-x-4.5' : 'translate-x-0.5'
          }`} />
        </button>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function PageBuilderPage() {
  const [components, setComponents] = useState<PageComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editTarget, setEditTarget] = useState<PageComponent | null>(null);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    fetch('/api/admin/page-components?page=home')
      .then(r => r.json())
      .then((data: PageComponent[]) => {
        setComponents(data.sort((a, b) => a.order - b.order));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showSaved = useCallback(() => {
    setSaved(true);
    setSaveError(false);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  const showError = useCallback(() => {
    setSaveError(true);
    setTimeout(() => setSaveError(false), 3000);
  }, []);

  async function handleToggle(id: string, enabled: boolean) {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, enabled } : c));
    await fetch(`/api/admin/page-components/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
    showSaved();
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    setComponents(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next.map((c, i) => ({ ...c, order: i }));
    });
  }

  function handleMoveDown(index: number) {
    setComponents(prev => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next.map((c, i) => ({ ...c, order: i }));
    });
  }

  async function handleSaveOrder() {
    setSaving(true);
    const orderedIds = components.map(c => c.id);
    // 각 컴포넌트의 order를 개별 업데이트
    const results = await Promise.all(
      components.map((c, i) =>
        fetch(`/api/admin/page-components/${c.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: i }),
        })
      )
    );
    setSaving(false);
    if (results.every(r => r.ok)) {
      showSaved();
    } else {
      showError();
    }
  }

  async function handleSaveConfig(id: string, config: Record<string, unknown>) {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, config: config as unknown as import('@/lib/component-registry').ComponentConfig } : c));
    await fetch(`/api/admin/page-components/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config }),
    });
    showSaved();
  }

  return (
    <AuthGuard>
      <AdminNav />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">페이지 빌더</h1>
            <p className="text-sm text-gray-500 mt-0.5">홈 화면 컴포넌트를 on/off하고 순서를 변경하세요.</p>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                저장됨
              </span>
            )}
            {saveError && (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                저장 실패
              </span>
            )}
            <button
              onClick={handleSaveOrder}
              disabled={saving}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? '저장 중...' : '순서 저장'}
            </button>
          </div>
        </div>

        {/* 미리보기 링크 */}
        <div className="mb-4 p-3 bg-gray-50 rounded-xl flex items-center justify-between">
          <span className="text-xs text-gray-500">변경 사항은 즉시 홈 화면에 반영돼요.</span>
          <a
            href="/"
            target="_blank"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            홈 보기
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 8l6-6M8 8V2H2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Component List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {components.map((component, index) => (
              <ComponentRow
                key={component.id}
                component={component}
                index={index}
                total={components.length}
                onToggle={handleToggle}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onEdit={setEditTarget}
              />
            ))}
          </div>
        )}

        {/* 사용 가능 컴포넌트 안내 */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">등록된 컴포넌트</p>
          <div className="space-y-2">
            {COMPONENT_REGISTRY.map(meta => (
              <div key={meta.key} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-medium text-gray-700">{meta.label}</span>
                  <span className="text-xs text-gray-400 ml-2">{meta.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Config Edit Modal */}
      {editTarget && (
        <ConfigModal
          component={editTarget}
          onSave={handleSaveConfig}
          onClose={() => setEditTarget(null)}
        />
      )}
    </AuthGuard>
  );
}
