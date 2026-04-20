import { SortConfig } from "src/utils/sort";

export interface SortableHeaderProps<SortKey extends string = string> {
  colKey: SortKey;
  sortConfig: SortConfig<SortKey>;
  onSort: (key: SortKey) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

