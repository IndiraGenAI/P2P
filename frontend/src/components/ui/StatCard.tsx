import { ArrowDown, ArrowUp, type LucideIcon } from 'lucide-react';
import { Trend } from '@/common/enums';

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: Trend;
  icon?: LucideIcon;
}

export function StatCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
}: Readonly<StatCardProps>) {
  const isUpward = trend === Trend.Up;

  return (
    <div className="soft-card p-6">
      {Icon && (
        <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
          <Icon size={22} className="text-gray-700" />
        </div>
      )}
      <div className={Icon ? 'flex items-end justify-between' : ''}>
        <div>
          {!Icon && <p className="text-3xl font-bold text-gray-900 mb-4">{value}</p>}
          {Icon && <p className="text-sm text-gray-500 mb-2">{label}</p>}
          {Icon && <p className="text-2xl font-bold text-gray-900">{value}</p>}
          {!Icon && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{label}</p>
              <span
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  isUpward
                    ? 'soft-pill-emerald text-emerald-700'
                    : 'soft-pill-red text-red-700'
                }`}
              >
                {change}
                <span className="text-gray-500 font-normal">From last month</span>
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <span
            className={`flex items-center gap-1 text-xs font-semibold ${
              isUpward ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {isUpward ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
