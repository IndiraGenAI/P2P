import { ChevronRight } from 'lucide-react';

interface PageTitleProps {
  title: string;
  breadcrumb?: string;
}

export function PageTitle({ title, breadcrumb }: PageTitleProps) {
  return (
    <div className="px-6 pt-6 flex items-center justify-between flex-wrap gap-3">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">Home</span>
        <ChevronRight size={14} className="text-gray-400" />
        <span className="text-gray-900">{breadcrumb || title}</span>
      </div>
    </div>
  );
}
