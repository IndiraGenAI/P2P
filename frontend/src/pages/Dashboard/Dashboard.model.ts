export interface IDashboardRecord {
  name: string;
  code: string;
  status?: boolean;
  parent_id?: {
    id: number | null;
  };
  id: number;
}

export interface IDashboardStatus {
  status: boolean;
  id: number;
}
export interface IDashboardProps {
  filterModalClose?: boolean;
}

export interface IDashboardTablesSort {
  order: string;
  orderBy: string;
}