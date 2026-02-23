'use client';

import { useEffect, useRef } from 'react';

interface ConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  variant?: 'danger' | 'default';
}

export default function ConfirmModal({
  open,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = '확인',
  variant = 'default',
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      confirmRef.current?.focus();
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const confirmClass =
    variant === 'danger'
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-blue-600 text-white hover:bg-blue-700';

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6 whitespace-pre-line">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
