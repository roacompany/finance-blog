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
      className="-mx-4 px-4 mt-8 flex gap-2 overflow-x-auto scrollbar-hide"
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
            className={`flex-shrink-0 min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-semibold transition-all inline-flex items-center ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'border border-gray-200 text-gray-600 hover:border-blue-600 hover:bg-blue-50'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
