'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * MobileMenu Component
 * 토스 스타일의 모바일 햄버거 메뉴
 */
export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Escape 키로 메뉴 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 배경 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 md:hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-lg font-bold text-gray-900">메뉴</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="메뉴 닫기"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          <Link
            href="/"
            onClick={onClose}
            className="block px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            홈
          </Link>

          <Link
            href="/?filter=all"
            onClick={onClose}
            className="block px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            시리즈
          </Link>

          <div className="pt-2 border-t border-gray-200 mt-2">
            <Link
              href="/about"
              onClick={onClose}
              className="block px-4 py-3 text-base font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              About
            </Link>

            <Link
              href="/contact"
              onClick={onClose}
              className="block px-4 py-3 text-base font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Contact
            </Link>

            <Link
              href="/privacy"
              onClick={onClose}
              className="block px-4 py-3 text-base font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Privacy
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            © 2026 ROA Finance. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
