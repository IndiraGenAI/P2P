import {
  BadgeCheck,
  Database,
  FileSignature,
  FileText,
  GitBranch,
  LayoutGrid,
  LogOut,
  Network,
  PackageCheck,
  Receipt,
  ShieldCheck,
  ShoppingCart,
  UserCheck,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import type { PageKey } from '@/types';

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  key: PageKey;
}

interface SidebarProps {
  currentPage: PageKey;
  setCurrentPage: (page: PageKey) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onSignOut: () => void;
}

const menuItems: SidebarItem[] = [
  { icon: LayoutGrid, label: 'Dashboard', key: 'dashboard' },
  { icon: Users, label: 'User Management', key: 'user-management' },
  { icon: GitBranch, label: 'Workflows', key: 'workflows' },
  { icon: Network, label: 'Workflow (V2)', key: 'workflows-v2' },
  { icon: PackageCheck, label: 'Item Approval', key: 'item-approval' },
  { icon: UserCheck, label: 'Vendor Approval', key: 'vendor-approval' },
  { icon: BadgeCheck, label: 'Budget Approval', key: 'budget-approval' },
  { icon: Database, label: 'Masters Control', key: 'masters-control' },
  { icon: ShieldCheck, label: 'Role Config', key: 'role-config' },
  { icon: FileText, label: 'Purchase Request', key: 'purchase-request' },
  { icon: FileSignature, label: 'Rate Contract', key: 'rate-contract' },
  { icon: ShoppingCart, label: 'Purchase Order', key: 'purchase-order' },
  { icon: Receipt, label: 'Direct Invoice', key: 'direct-invoice' },
  { icon: Wallet, label: 'Budgets', key: 'budgets' },
];

export function Sidebar({
  currentPage,
  setCurrentPage,
  sidebarOpen,
  setSidebarOpen,
  onSignOut,
}: Readonly<SidebarProps>) {
  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <aside
        className={`bg-white h-screen soft-sidebar transition-all duration-300 ease-in-out z-40 flex-shrink-0
          fixed lg:sticky top-0 left-0 flex flex-col
          ${
            sidebarOpen
              ? 'w-64 translate-x-0'
              : 'w-64 -translate-x-full lg:translate-x-0 lg:w-[72px]'
          }`}
      >
        <div
          className={`h-16 flex items-center flex-shrink-0 border-b border-gray-100 bg-white overflow-hidden transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'px-6 justify-start' : 'px-4 lg:justify-center'
          }`}
        >
          <Logo size="sm" iconOnly={!sidebarOpen} />
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4">
          {menuItems.map((item) => {
            const isActive = currentPage === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setCurrentPage(item.key)}
                title={sidebarOpen ? undefined : item.label}
                className={`w-full flex items-center rounded-lg text-sm transition-all duration-300 ease-in-out mb-0.5 px-3 py-2.5 overflow-hidden ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon
                  size={18}
                  className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
                    sidebarOpen ? '' : 'mx-auto'
                  }`}
                />
                <span
                  className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                    sidebarOpen ? 'ml-3 max-w-[200px] opacity-100' : 'ml-0 max-w-0 opacity-0'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex-shrink-0 border-t border-gray-100 bg-white py-3 px-3">
          <button
            onClick={onSignOut}
            title={sidebarOpen ? undefined : 'Logout'}
            className="w-full flex items-center rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all duration-300 ease-in-out font-medium px-3 py-2.5 overflow-hidden"
          >
            <LogOut
              size={18}
              className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
                sidebarOpen ? '' : 'mx-auto'
              }`}
            />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                sidebarOpen ? 'ml-3 max-w-[200px] opacity-100' : 'ml-0 max-w-0 opacity-0'
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
