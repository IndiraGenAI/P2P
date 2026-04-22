import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ability } from '@/ability';
import { useSidebarPermissionCodes } from '@/contexts/SidebarPermissionCodeContext';

interface RequirePageProps {
  pageCode: string;
  action?: string;
}



export function RequirePage({ pageCode, action = 'VIEW' }: Readonly<RequirePageProps>) {
  const { isCode } = useSidebarPermissionCodes();
  const location = useLocation();
  const allowed = ability.can(action, pageCode) && isCode.includes(pageCode);
  if (!allowed) {
    return <Navigate to="/access-denied" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
