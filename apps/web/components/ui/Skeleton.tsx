'use client';

interface SkeletonBoxProps {
  className?: string;
}

export function SkeletonBox({ className = '' }: SkeletonBoxProps) {
  return (
    <div className={`animate-pulse rounded-xl bg-gray-200 ${className}`} />
  );
}
