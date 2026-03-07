'use client';

import { useEffect, useState } from 'react';

/**
 * ReadingProgress Component
 * 토스 스타일의 읽기 진행률 표시 바
 * - 스크롤에 따라 0-100% 진행률 표시
 * - 상단 고정 (sticky)
 * - 부드러운 애니메이션
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const windowHeight = window.innerHeight;
      const documentHeight = article.clientHeight;
      const scrollTop = window.scrollY;
      const articleTop = article.offsetTop;

      // 아티클이 시작되기 전에는 0%
      if (scrollTop < articleTop) {
        setProgress(0);
        return;
      }

      // 아티클 내에서의 스크롤 위치 계산
      const scrolled = scrollTop - articleTop;
      const maxScroll = documentHeight - windowHeight;

      if (maxScroll <= 0) {
        setProgress(100);
        return;
      }

      const percentage = Math.min((scrolled / maxScroll) * 100, 100);
      setProgress(percentage);
    };

    // 초기 실행
    updateProgress();

    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-100">
      <div
        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="읽기 진행률"
      />
    </div>
  );
}
