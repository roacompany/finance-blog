'use client';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && (
        <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      )}
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      {description && <p className="text-xs text-gray-400 mb-4 text-center max-w-xs">{description}</p>}
      {action && (
        action.href ? (
          <a
            href={action.href}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            {action.label}
          </a>
        ) : (
          <button
            onClick={action.onClick}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
