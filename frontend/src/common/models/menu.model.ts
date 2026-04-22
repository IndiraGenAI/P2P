import type { LucideIcon } from 'lucide-react';

/**
 * Tree-shaped menu item used by both the sidebar and the route table.
 *
 * - Leaves carry a `to` URL and (optionally) a `pageCode` + `action` for
 *   permission-driven visibility/access.
 * - Groups carry `children` and are auto-hidden when no child is visible.
 */
export interface MenuItem {
  key: string;
  label: string;
  icon: LucideIcon;
  to?: string;
  pageCode?: string;
  action?: string;
  children?: MenuItem[];
}
