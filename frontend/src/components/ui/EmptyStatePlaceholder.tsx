import type { LucideIcon } from 'lucide-react';
import { Search } from 'lucide-react';
import type { ReactNode } from 'react';

export interface EmptyStatePlaceholderProps {
  /** Main heading (e.g. "No data") */
  title?: string;
  /** Supporting text; use inline elements for emphasis (e.g. <span className="text-gray-700">) */
  description?: ReactNode;
  /** Lucide icon; defaults to Search */
  icon?: LucideIcon;
  /** Min height for the region (default matches master-style empty areas) */
  minHeightClass?: string;
  className?: string;
}

/**
 * Shared empty-state layout: icon tile, title, muted description.
 * Used when filters must be chosen before content loads (e.g. Workflows scope).
 */
export const EmptyStatePlaceholder = ({
  title = 'No data',
  description,
  icon: Icon = Search,
  minHeightClass = 'min-h-[min(360px,50vh)]',
  className = '',
}: EmptyStatePlaceholderProps) => {
  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center px-6 py-10 ${minHeightClass} ${className}`.trim()}
    >
      <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mb-4 ring-1 ring-sky-100/80">
        <Icon size={26} className="text-sky-600" strokeWidth={1.75} />
      </div>
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      {description ? (
        <div className="text-xs text-gray-500 mt-1.5 text-center max-w-md leading-relaxed">
          {description}
        </div>
      ) : null}
    </div>
  );
};
