import Link from 'next/link';
import type { PromoBannerConfig } from '@/lib/component-registry';

export function PromoBanner({ config }: { config: PromoBannerConfig }) {
  if (!config.enabled) return null;
  return (
    <div
      className="w-full py-2.5 px-6 flex items-center justify-center gap-4 text-sm"
      style={{ backgroundColor: config.bgColor, color: config.textColor }}
    >
      <span className="text-xs sm:text-sm">{config.text}</span>
      <Link
        href={config.ctaLink}
        className="shrink-0 text-xs font-semibold underline underline-offset-2"
        style={{ color: config.textColor }}
      >
        {config.ctaText} →
      </Link>
    </div>
  );
}
