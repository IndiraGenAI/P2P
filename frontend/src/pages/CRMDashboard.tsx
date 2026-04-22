import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { GaugeChart } from '@/components/ui/GaugeChart';
import { STATS_CHART_DATA } from '@/data';
import { CHART_COLORS } from '@/common/constants';
import { Trend } from '@/common/enums';

type DateRange = 'Monthly' | 'Quarterly' | 'Annually';

const DATE_RANGE_OPTIONS: readonly DateRange[] = ['Monthly', 'Quarterly', 'Annually'];

export function CRMDashboard() {
  const [selectedRange, setSelectedRange] = useState<DateRange>('Monthly');

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatCard label="Active Deal" value="$120,369" change="+20%" trend={Trend.Up} />
        <StatCard label="Revenue Total" value="$234,210" change="+9.0%" trend={Trend.Up} />
        <StatCard label="Closed Deals" value="874" change="-4.5%" trend={Trend.Down} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Statistics</h3>
              <p className="text-sm text-gray-500 mt-1">Target you've set for each month</p>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {DATE_RANGE_OPTIONS.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setSelectedRange(range)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                    selectedRange === range
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-8 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900">$212,142.12</p>
                <span className="text-xs font-semibold soft-pill-emerald text-emerald-700 px-2 py-0.5 rounded">
                  +23.2%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Avg. Yearly Profit</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900">$30,321.23</p>
                <span className="text-xs font-semibold soft-pill-red text-red-700 px-2 py-0.5 rounded">
                  -12.3%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Avg. Yearly Profit</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={STATS_CHART_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                  fill="url(#colorSales)"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={CHART_COLORS.secondary}
                  strokeWidth={2}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="soft-card p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Estimated Revenue</h3>
              <p className="text-sm text-gray-500 mt-1">Target you've set for each month</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={18} />
            </button>
          </div>

          <div className="flex flex-col items-center py-4">
            <GaugeChart value={90} size="md" />
            <div className="-mt-16 text-center">
              <p className="text-sm text-gray-500 mb-1">June Goals</p>
              <p className="text-3xl font-bold text-gray-900">$90</p>
            </div>
          </div>

          <div className="space-y-4 mt-6 pt-6 border-t border-gray-100">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">Marketing</p>
                <p className="text-sm font-semibold text-gray-700">85%</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-base font-semibold text-gray-900 min-w-[80px]">$30,569.00</p>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">Sales</p>
                <p className="text-sm font-semibold text-gray-700">55%</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-base font-semibold text-gray-900 min-w-[80px]">$20,486.00</p>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '55%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
