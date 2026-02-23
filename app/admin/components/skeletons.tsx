'use client';

import { SkeletonBox } from '@/components/ui/Skeleton';

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SkeletonBox className="h-8 w-40 mb-2" />
      <SkeletonBox className="h-4 w-64 mb-6" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox key={i} className="h-20 sm:h-24" />
        ))}
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SkeletonBox className="h-64" />
        <SkeletonBox className="h-64" />
      </div>
    </div>
  );
}

export function PostsListSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <SkeletonBox className="h-8 w-36 mb-2" />
          <SkeletonBox className="h-4 w-24" />
        </div>
        <SkeletonBox className="h-10 w-24" />
      </div>
      <SkeletonBox className="h-16 mb-4 sm:mb-6" />
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-gray-50 flex items-center gap-4">
            <SkeletonBox className="h-5 flex-1" />
            <SkeletonBox className="h-5 w-16" />
            <SkeletonBox className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PostEditSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SkeletonBox className="h-4 w-16 mb-2" />
      <SkeletonBox className="h-8 w-48 mb-4" />
      <div className="flex gap-2 mb-6">
        <SkeletonBox className="h-10 w-24" />
        <SkeletonBox className="h-10 w-16" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <SkeletonBox className="h-4 w-20 mb-1" />
            <SkeletonBox className="h-11 w-full" />
          </div>
        ))}
      </div>
      <SkeletonBox className="h-64 mt-4 sm:mt-6" />
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SkeletonBox className="h-8 w-32 mb-6 sm:mb-8" />
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-4 mb-8">
        <SkeletonBox className="h-6 w-24 mb-2" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>
            <SkeletonBox className="h-4 w-20 mb-1" />
            <SkeletonBox className="h-11 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TopicsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <SkeletonBox className="h-8 w-40 mb-2" />
          <SkeletonBox className="h-4 w-72" />
        </div>
        <SkeletonBox className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox key={i} className="h-20" />
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBox key={i} className="h-9 w-16" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBox key={i} className="h-24" />
        ))}
      </div>
    </div>
  );
}
