'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';

interface TabItem {
  id: string;
  label: string;
  href: string;
}

interface FeedTabsProps {
  tabs: TabItem[];
  activeTabId: string;
}

export default function FeedTabs({ tabs, activeTabId }: FeedTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const active = activeRef.current;
      const offset = active.offsetLeft - container.offsetWidth / 2 + active.offsetWidth / 2;
      container.scrollTo({ left: offset, behavior: 'smooth' });
    }
  }, [activeTabId]);

  return (
    <div
      ref={scrollRef}
      role="tablist"
      className="-mx-4 px-4 mt-8 flex gap-6 overflow-x-auto scrollbar-hide border-b border-gray-200"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <Link
            key={tab.id}
            ref={isActive ? activeRef : undefined}
            href={tab.href}
            scroll={false}
            role="tab"
            aria-selected={isActive}
            className={`flex-shrink-0 min-h-[44px] pb-3 text-[15px] font-semibold transition-colors duration-200 inline-flex items-center ${
              isActive
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
