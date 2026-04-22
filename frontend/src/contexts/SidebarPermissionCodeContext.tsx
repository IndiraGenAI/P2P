import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useAppSelector } from '@/state/app.hooks';
import { authSelector } from '@/state/auth/auth.reducer';
import { applyAbility, pageCodesFrom } from '@/ability';

interface SidebarPermissionCodeContextValue {
  isCode: string[];
  /**
   * Kept for backward compatibility. `isCode` is now derived from the auth
   * state, so external callers no longer need to push into it.
   */
  setIsCode: (codes: string[]) => void;
}

const SidebarPermissionCodeContext = createContext<SidebarPermissionCodeContextValue>({
  isCode: [],
  setIsCode: () => {},
});

interface SidebarPermissionCodeProviderProps {
  children: ReactNode;
}

export const SidebarPermissionCodeProvider = ({
  children,
}: SidebarPermissionCodeProviderProps) => {
  const { accessToken, profile } = useAppSelector(authSelector);
  const isLoggedIn = !!accessToken;

  const isCode = useMemo(() => {
    if (!isLoggedIn) return [];
    return pageCodesFrom(profile.data?.role_permissions);
  }, [isLoggedIn, profile.data]);

  // Keep CASL ability in sync with the same source of truth, in the same
  // render pass — this avoids a one-render gap where `profile.data` exists
  // but `ability` is still empty (which causes RequirePage to bounce the
  // user to /access-denied on a hard refresh).
  useMemo(() => {
    if (!isLoggedIn) {
      applyAbility([]);
      return;
    }
    if (profile.data) applyAbility(profile.data.role_permissions ?? []);
  }, [isLoggedIn, profile.data]);

  const value = useMemo(
    () => ({ isCode, setIsCode: () => {} }),
    [isCode],
  );

  return (
    <SidebarPermissionCodeContext.Provider value={value}>
      {children}
    </SidebarPermissionCodeContext.Provider>
  );
};

export const useSidebarPermissionCodes = () =>
  useContext(SidebarPermissionCodeContext);
