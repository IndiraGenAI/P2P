import { useState } from 'react';
import { Bell, ChevronDown, LogOut, Menu, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/state/app.hooks';
import { authSelector } from '@/state/auth/auth.reducer';

interface HeaderProps {
  onSignOut: () => void;
  toggleSidebar: () => void;
}

export function Header({
  onSignOut,
  toggleSidebar,
}: Readonly<HeaderProps>) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { profile } = useAppSelector(authSelector);
  const user = profile.data;
  const firstName = user?.first_name?.trim() ?? '';
  const lastName = user?.last_name?.trim() ?? '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'User';
  const shortName = firstName || fullName;
  const initial =
    firstName?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    'U';
  const email = user?.email ?? '';

  return (
    <header className="h-16 flex-shrink-0 bg-white soft-header flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-600 soft-btn"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2.5 hover:bg-gray-100 rounded-full text-gray-600 border border-gray-200"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 pl-1 pr-3 py-1 hover:bg-gray-50 rounded-full"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm">
              {initial}
            </div>
            <span className="text-sm font-medium text-gray-700">{shortName}</span>
            <ChevronDown size={14} className="text-gray-500" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-900">{fullName}</p>
                <p className="text-sm text-gray-500 truncate">{email}</p>
              </div>
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/profile');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <UserCircle size={18} /> Edit profile
                </button>
              </div>
              <div className="border-t border-gray-100 pt-2">
                <button
                  type="button"
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
