'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MobileMenu } from './MobileMenu';

/**
 * Header Component
 * 토스 스타일의 전역 네비게이션 헤더
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl font-bold text-gray-900">
              ROA Finance
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
            >
              홈
            </Link>
            <Link
              href="/calculators"
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
            >
              계산기
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
            >
              소개
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
            >
              문의
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="메뉴 열기"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
