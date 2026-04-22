import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { APP_MENU_ITEMS } from '@/data';
import { ability } from '@/ability';
import { useSidebarPermissionCodes } from '@/contexts/SidebarPermissionCodeContext';
import { filterMenuTree } from '@/common/utils';
import type { MenuItem } from '@/common/models';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onSignOut: () => void;
}

interface SidebarLeafProps {
  item: MenuItem;
  isSidebarOpen: boolean;
  onNavigate: () => void;
}

function SidebarLeaf({ item, isSidebarOpen, onNavigate }: Readonly<SidebarLeafProps>) {
  if (!item.to) return null;
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      title={isSidebarOpen ? undefined : item.label}
      className={({ isActive }) =>
        `w-full flex items-center rounded-lg text-sm transition-all duration-300 ease-in-out mb-0.5 px-3 py-2.5 overflow-hidden ${
          isActive
            ? 'bg-emerald-50 text-emerald-600 font-medium'
            : 'text-gray-600 hover:bg-gray-50'
        }`
      }
    >
      <Icon
        size={18}
        className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? '' : 'mx-auto'
        }`}
      />
      <span
        className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-3 max-w-[200px] opacity-100' : 'ml-0 max-w-0 opacity-0'
        }`}
      >
        {item.label}
      </span>
    </NavLink>
  );
}

interface SidebarGroupProps {
  item: MenuItem;
  isSidebarOpen: boolean;
  onNavigate: () => void;
  onExpandSidebar: () => void;
}

function SidebarGroup({
  item,
  isSidebarOpen,
  onNavigate,
  onExpandSidebar,
}: Readonly<SidebarGroupProps>) {
  const { pathname } = useLocation();
  const Icon = item.icon;
  const childActive = item.children?.some((c) => c.to && pathname.startsWith(c.to));
  const [open, setOpen] = useState<boolean>(!!childActive);

  useEffect(() => {
    if (childActive) setOpen(true);
  }, [childActive]);

  if (!isSidebarOpen) {
    return (
      <div className="mb-0.5">
        <button
          type="button"
          title={item.label}
          aria-label={`Expand ${item.label}`}
          onClick={() => {
            // When the sidebar is collapsed, clicking a group icon should
            // expand the sidebar AND auto-open this group so the user can
            // immediately see the children they were reaching for.
            onExpandSidebar();
            setOpen(true);
          }}
          className={`w-full flex items-center rounded-lg text-sm transition px-3 py-2.5 overflow-hidden ${
            childActive
              ? 'bg-emerald-50 text-emerald-600 font-medium'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Icon size={18} className="mx-auto flex-shrink-0" />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between rounded-lg text-sm transition px-3 py-2.5 ${
          childActive
            ? 'text-emerald-700 font-medium'
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <span className="flex items-center min-w-0">
          <Icon size={18} className="flex-shrink-0" />
          <span className="ml-3 truncate">{item.label}</span>
        </span>
        <ChevronDown
          size={14}
          className={`flex-shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="ml-4 mt-1 border-l border-gray-100 pl-2">
          {item.children?.map((child) => (
            <SidebarLeaf
              key={child.key}
              item={child}
              isSidebarOpen={isSidebarOpen}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  onSignOut,
}: Readonly<SidebarProps>) {
  const { isCode } = useSidebarPermissionCodes();

  // Re-render when CASL ability is updated (login / logout / role switch).
  const [, setTick] = useState(0);
  useEffect(() => ability.on('updated', () => setTick((v) => v + 1)), []);

  const visibleItems = useMemo(
    () => filterMenuTree(APP_MENU_ITEMS, ability, isCode),
    [isCode],
  );

  const handleNavigate = () => {
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handleExpandSidebar = () => setIsSidebarOpen(true);

  return (
    <>
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <aside
        className={`bg-white h-screen soft-sidebar transition-all duration-300 ease-in-out z-40 flex-shrink-0
          fixed lg:sticky top-0 left-0 flex flex-col
          ${
            isSidebarOpen
              ? 'w-64 translate-x-0'
              : 'w-64 -translate-x-full lg:translate-x-0 lg:w-[72px]'
          }`}
      >
        <div
          className={`h-16 flex items-center flex-shrink-0 border-b border-gray-100 bg-white overflow-hidden transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'px-6 justify-start' : 'px-4 lg:justify-center'
          }`}
        >
          <Logo size="sm" iconOnly={!isSidebarOpen} />
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4">
          {visibleItems.length === 0 && (
            <p className="px-3 py-2 text-xs text-gray-400">-</p>
          )}
          {visibleItems.map((item) =>
            item.children?.length ? (
              <SidebarGroup
                key={item.key}
                item={item}
                isSidebarOpen={isSidebarOpen}
                onNavigate={handleNavigate}
                onExpandSidebar={handleExpandSidebar}
              />
            ) : (
              <SidebarLeaf
                key={item.key}
                item={item}
                isSidebarOpen={isSidebarOpen}
                onNavigate={handleNavigate}
              />
            ),
          )}
        </nav>

        <div className="flex-shrink-0 border-t border-gray-100 bg-white py-3 px-3">
          <button
            type="button"
            onClick={onSignOut}
            title={isSidebarOpen ? undefined : 'Logout'}
            className="w-full flex items-center rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all duration-300 ease-in-out font-medium px-3 py-2.5 overflow-hidden"
          >
            <LogOut
              size={18}
              className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
                isSidebarOpen ? '' : 'mx-auto'
              }`}
            />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                isSidebarOpen
                  ? 'ml-3 max-w-[200px] opacity-100'
                  : 'ml-0 max-w-0 opacity-0'
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
