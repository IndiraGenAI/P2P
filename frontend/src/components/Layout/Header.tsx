import { useState } from 'react';
import {
  Bell,
  ChevronDown,
  HelpCircle,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  UserCircle,
} from 'lucide-react';
import type { PageKey } from '@/types';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  onSignOut: () => void;
  setCurrentPage: (page: PageKey) => void;
  toggleSidebar: () => void;
}

export function Header({
  darkMode,
  setDarkMode,
  onSignOut,
  setCurrentPage,
  toggleSidebar,
}: Readonly<HeaderProps>) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-16 flex-shrink-0 bg-white soft-header flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={toggleSidebar}
          className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-600 soft-btn"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search or type command..."
            className="w-full pl-10 pr-16 py-2.5 rounded-xl text-sm soft-input"
          />
          <kbd
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white rounded-md px-1.5 py-0.5"
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}
          >
            ⌘ K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 hover:bg-gray-50 rounded-full text-gray-600 soft-btn"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="relative p-2.5 hover:bg-gray-100 rounded-full text-gray-600 border border-gray-200">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-1 pr-3 py-1 hover:bg-gray-50 rounded-full"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm">
              M
            </div>
            <span className="text-sm font-medium text-gray-700">Musharof</span>
            <ChevronDown size={14} className="text-gray-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-900">Musharof Chowdhury</p>
                <p className="text-sm text-gray-500">randomuser@pimjo.com</p>
              </div>
              <div className="py-2">
                <button
                  onClick={() => {
                    setCurrentPage('profile');
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <UserCircle size={18} /> Edit profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  <Settings size={18} /> Account settings
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  <HelpCircle size={18} /> Support
                </button>
              </div>
              <div className="border-t border-gray-100 pt-2">
                <button
                  onClick={onSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <LogOut size={18} /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
