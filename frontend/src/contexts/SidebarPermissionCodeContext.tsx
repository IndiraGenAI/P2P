import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface SidebarPermissionCodeContextValue {
  isCode: string[];
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
  const [isCode, setIsCode] = useState<string[]>([]);
  const value = useMemo(() => ({ isCode, setIsCode }), [isCode]);
  return (
    <SidebarPermissionCodeContext.Provider value={value}>
      {children}
    </SidebarPermissionCodeContext.Provider>
  );
};

export const useSidebarPermissionCodes = () =>
  useContext(SidebarPermissionCodeContext);
