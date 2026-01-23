import Link from 'next/link';
import { cn, getCardClasses } from '@/lib/design-system';

interface CardProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  hover?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  role?: string;
  'aria-label'?: string;
}

/**
 * Card Component
 * 토스 스타일의 재사용 가능한 카드 컴포넌트
 */
export function Card({
  children,
  href,
  className,
  hover = true,
  shadow = 'none',
  padding = 'md',
  onClick,
  role,
  'aria-label': ariaLabel,
}: CardProps) {
  const cardClasses = cn(
    getCardClasses({ hover, shadow, padding }),
    'group', // hover 상태를 자식에게 전달하기 위한 group 클래스
    className
  );

  // Link 카드
  if (href) {
    return (
      <Link
        href={href}
        className={cardClasses}
        role={role}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  // 클릭 가능한 카드
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(cardClasses, 'text-left w-full')}
        role={role}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    );
  }

  // 일반 카드
  return (
    <div className={cardClasses} role={role} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
