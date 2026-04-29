import { useEffect, useState } from 'react';
import { ShieldCheck, UserCheck, Users, UserX } from 'lucide-react';
import userService from '@/services/user/user.service';
import roleService from '@/services/role/role.service';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  activeRoles: number;
}

const INITIAL_STATS: DashboardStats = {
  totalUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  activeRoles: 0,
};

export function EcommerceDashboard() {
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      setIsLoading(true);
      try {
        const [allUsers, activeUsers, activeRoles] = await Promise.all([
          userService.searchUserData({ take: 1 }),
          userService.searchUserData({ take: 1, status: 'ENABLE' }),
          roleService.searchRoleData({ take: 1, status: true }),
        ]);

        if (cancelled) return;

        const totalUsers = allUsers?.data?.meta?.itemCount ?? 0;
        const active = activeUsers?.data?.meta?.itemCount ?? 0;

        setStats({
          totalUsers,
          activeUsers: active,
          inactiveUsers: Math.max(totalUsers - active, 0),
          activeRoles: activeRoles?.data?.meta?.itemCount ?? 0,
        });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Active Users',
      value: stats.activeUsers,
      icon: UserCheck,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Inactive Users',
      value: stats.inactiveUsers,
      icon: UserX,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      label: 'Active Roles',
      value: stats.activeRoles,
      icon: ShieldCheck,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">
          Overview of users and roles in the system
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
          <div key={label} className="soft-card p-6">
            <div
              className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center mb-6`}
            >
              <Icon size={22} className={iconColor} />
            </div>
            <p className="text-sm text-gray-500 mb-2">{label}</p>
            <p className="text-2xl font-bold text-gray-900">
              {isLoading ? (
                <span className="inline-block h-6 w-16 bg-gray-100 rounded animate-pulse align-middle" />
              ) : (
                value.toLocaleString()
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
