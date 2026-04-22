import type { LucideIcon } from 'lucide-react';



export interface MenuItem {
  key: string;
  label: string;
  icon: LucideIcon;
  to?: string;
  pageCode?: string;
  action?: string;
  children?: MenuItem[];
}
