'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

/**
 * TableOfContents Component
 * 토스 스타일의 목차 (Table of Contents)
 * - Desktop: 우측 고정 (sticky)
 * - Mobile: 상단 접을 수 있는 섹션
 * - IntersectionObserver로 현재 섹션 하이라이트
 */
export function TableOfContents({ className = '' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // H2, H3 헤딩 추출
    const article = document.querySelector('article');
    if (!article) return;

    const headingElements = article.querySelectorAll('h2, h3');
    const headingData: Heading[] = Array.from(headingElements).map((heading) => {
      // id가 없으면 생성
      if (!heading.id) {
        heading.id = heading.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9가-힣\s]/g, '')
          .replace(/\s+/g, '-') || '';
      }

      return {
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.substring(1)),
      };
    });

    setHeadings(headingData);

    // IntersectionObserver 설정
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 1.0,
      }
    );

    headingElements.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      headingElements.forEach((heading) => {
        observer.unobserve(heading);
      });
    };
  }, []);

  if (headings.length === 0) {
    return null;
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // 헤더 높이만큼 오프셋
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile: 접을 수 있는 목차 */}
      <div className={`lg:hidden mb-8 ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 text-left transition-all hover:bg-gray-100"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-2 text-base font-bold text-gray-900">
            <span>📑</span>
            <span>목차</span>
          </span>
          <span
            className={`text-gray-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          >
            ▼
          </span>
        </button>

        {isOpen && (
          <nav className="mt-3 p-4 bg-white rounded-xl border border-gray-200">
            <ul className="space-y-2">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <button
                    onClick={() => handleClick(heading.id)}
                    className={`
                      block w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                      ${heading.level === 3 ? 'pl-6' : ''}
                      ${
                        activeId === heading.id
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Desktop: 우측 고정 목차 */}
      <nav
        className={`hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto ${className}`}
      >
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
            <span>📑</span>
            <span>목차</span>
          </h2>
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li key={heading.id}>
                <button
                  onClick={() => handleClick(heading.id)}
                  className={`
                    block w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                    ${heading.level === 3 ? 'pl-6 text-xs' : ''}
                    ${
                      activeId === heading.id
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
