'use client';

import { useState, useEffect } from 'react';

interface FloatingShareProps {
  title: string;
  url: string;
}

export function FloatingShare({ title, url }: FloatingShareProps) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div
      className={`
        hidden xl:flex fixed left-[max(1rem,calc(50%-580px))] top-1/3
        flex-col gap-3 z-40 transition-opacity duration-300
        ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <button
        onClick={handleTwitter}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-colors shadow-sm"
        aria-label="Twitter에 공유"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      <button
        onClick={handleFacebook}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-[#1877F2] hover:border-[#1877F2] transition-colors shadow-sm"
        aria-label="Facebook에 공유"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101z" />
        </svg>
      </button>

      <button
        onClick={handleCopy}
        className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors shadow-sm ${
          copied
            ? 'bg-green-600 border-green-600 text-white'
            : 'bg-white border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-600'
        }`}
        aria-label="링크 복사"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {copied ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          )}
        </svg>
      </button>
    </div>
  );
}
