import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="p-6">
      <div className="soft-card p-12 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5">
          <Construction size={28} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 max-w-md">
          This module is under construction. Hook it up to your backend service to start using it.
        </p>
      </div>
    </div>
  );
}
