import type { LucideIcon } from 'lucide-react';



export interface MenuItem {
  key: string;
  label: string;
  icon: LucideIcon;
  to?: string;
  /** When true, `NavLink` matches this route exactly (not prefix). */
  end?: boolean;
  pageCode?: string;
  action?: string;
  children?: MenuItem[];
}
