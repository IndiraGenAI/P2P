import type { LucideIcon } from 'lucide-react';

export type Trend = 'up' | 'down';

export type PageKey =
  | 'ecommerce'
  | 'crm'
  | 'analytics'
  | 'marketing'
  | 'stocks'
  | 'saas'
  | 'logistics'
  | 'profile'
  | 'tables'
  | string;

export interface SubMenuItem {
  label: string;
  key: PageKey;
  badge?: string;
}

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  key: string;
  badge?: string;
  hasArrow?: boolean;
  subItems?: SubMenuItem[];
}

export interface StatsChartPoint {
  month: string;
  sales: number;
  revenue: number;
}

export interface MonthlySalesPoint {
  month: string;
  value: number;
}

export type RowStatus = 'Hired' | 'Pending';

export interface TableRow {
  id: number;
  user: string;
  email: string;
  position: string;
  salary: string;
  office: string;
  status: RowStatus;
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  role: string;
  location: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}
