import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ability } from '@/ability';
import { useSidebarPermissionCodes } from '@/contexts/SidebarPermissionCodeContext';

interface RequirePageProps {
  pageCode: string;
  action?: string;
}

/**
 * Route guard mirroring the WEB project's
 * `<Route element={ability.can(...) && isCode.includes(...) ? <Outlet/> : <NotFound/>}>`
 * pattern.
 *
 * When the user lacks the required permission, redirect to /access-denied so a
 * direct URL hit cannot bypass the hidden sidebar entry.
 */
export function RequirePage({ pageCode, action = 'VIEW' }: Readonly<RequirePageProps>) {
  const { isCode } = useSidebarPermissionCodes();
  const location = useLocation();
  const allowed = ability.can(action, pageCode) && isCode.includes(pageCode);
  if (!allowed) {
    return <Navigate to="/access-denied" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
