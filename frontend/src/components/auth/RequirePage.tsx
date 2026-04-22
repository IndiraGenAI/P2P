import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ability } from '@/ability';
import { useSidebarPermissionCodes } from '@/contexts/SidebarPermissionCodeContext';
import { useAppSelector } from '@/state/app.hooks';
import { authSelector } from '@/state/auth/auth.reducer';

interface RequirePageProps {
  pageCode: string;
  action?: string;
}

export function RequirePage({ pageCode, action = 'VIEW' }: Readonly<RequirePageProps>) {
  const { isCode } = useSidebarPermissionCodes();
  const { profile } = useAppSelector(authSelector);
  const location = useLocation();

  // Wait for the profile (and therefore permissions) before deciding.
  // Without this, a hard refresh on a protected route evaluates against
  // an empty ability set and bounces the user to /access-denied.
  if (!profile.data || profile.loading) {
    return null;
  }

  const allowed = ability.can(action, pageCode) && isCode.includes(pageCode);
  if (!allowed) {
    return <Navigate to="/access-denied" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
