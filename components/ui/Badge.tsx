import { cn, componentStyles, getBadgeColor } from '@/lib/design-system';

interface BadgeProps {
  children: React.ReactNode;
  tag?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Badge Component
 * 토스 스타일의 배지/태그 컴포넌트
 * tag prop을 전달하면 자동으로 해당 태그의 색상 적용
 */
export function Badge({ children, tag, size = 'sm', className }: BadgeProps) {
  const badgeClasses = cn(
    componentStyles.badge.base,
    componentStyles.badge.sizes[size],
    className
  );

  // tag prop이 있으면 동적 색상 적용
  if (tag) {
    const colors = getBadgeColor(tag);
    return (
      <span
        className={badgeClasses}
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
        }}
      >
        {children}
      </span>
    );
  }

  // tag prop이 없으면 기본 스타일
  return (
    <span className={cn(badgeClasses, 'bg-gray-100 text-gray-700')}>
      {children}
    </span>
  );
}
