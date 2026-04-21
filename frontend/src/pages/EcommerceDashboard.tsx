import { ArrowDown, ArrowUp, Box, Calendar, MoreVertical, Users } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { GaugeChart } from '@/components/ui/GaugeChart';
import { monthlySalesData, statsChartData } from '@/data/mockData';

export function EcommerceDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatCard label="Customers" value="3,782" change="11.01%" trend="up" icon={Users} />
        <StatCard label="Orders" value="5,359" change="9.05%" trend="down" icon={Box} />

        <div className="soft-card p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">Monthly Target</h3>
              <p className="text-sm text-gray-500 mt-1">Target you've set for each month</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={18} />
            </button>
          </div>

          <div className="flex flex-col items-center mt-2">
            <GaugeChart value={75.55} size="md" />
            <div className="-mt-16 text-center">
              <p className="text-2xl font-bold text-gray-900">75.55%</p>
              <span className="inline-block mt-1 text-xs font-semibold soft-pill-emerald text-emerald-700 px-2 py-0.5 rounded">
                +10%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Monthly Sales</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySalesData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
                <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col justify-center">
          <p className="text-center text-gray-600 mb-8 leading-relaxed">
            You earn <span className="font-semibold">$3287</span> today, it's higher than last
            month. Keep up your good work!
          </p>
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Target</p>
              <p className="text-sm font-semibold text-gray-900 flex items-center justify-center gap-1">
                $20K <ArrowDown size={12} className="text-red-500" />
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Revenue</p>
              <p className="text-sm font-semibold text-gray-900 flex items-center justify-center gap-1">
                $20K <ArrowUp size={12} className="text-emerald-500" />
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Today</p>
              <p className="text-sm font-semibold text-gray-900 flex items-center justify-center gap-1">
                $20K <ArrowUp size={12} className="text-emerald-500" />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="soft-card p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">Statistics</h3>
            <p className="text-sm text-gray-500 mt-1">Target you've set for each month</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['Overview', 'Sales', 'Revenue'].map((t, i) => (
                <button
                  key={t}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                    i === 0 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 text-sm text-gray-700 rounded-xl px-3 py-1.5 soft-btn">
              <Calendar size={14} /> Apr 15 - Apr 21
            </button>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={statsChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorStat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
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
                stroke="#059669"
                strokeWidth={2}
                fill="url(#colorStat)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
