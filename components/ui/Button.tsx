import Link from 'next/link';
import { cn, getButtonClasses } from '@/lib/design-system';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
}

/**
 * Button Component
 * 토스 스타일의 재사용 가능한 버튼 컴포넌트
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled = false,
  type = 'button',
  className,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const buttonClasses = cn(getButtonClasses(variant, size), className);

  // Link 버튼
  if (href && !disabled) {
    return (
      <Link href={href} className={buttonClasses} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  // 일반 버튼
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
