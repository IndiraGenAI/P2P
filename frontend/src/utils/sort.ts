import { useState } from "react";

export type SortOrder = "asc" | "desc" | null;
export interface SortConfig<SortKey extends string> {
  key: SortKey | "";
  order: SortOrder;
}

export function getNextSortConfig<SortKey extends string>(
  prev: SortConfig<SortKey>,
  key: SortKey
): SortConfig<SortKey> {
  if (prev.key !== key) return { key, order: "asc" };
  if (prev.order === "asc") return { key, order: "desc" };
  return { key: "" as SortKey, order: null };
}

export function sortByConfig<T, SortKey extends string>(
  data: T[],
  config: SortConfig<SortKey>,
  accessor: (item: T, key: SortKey) => string | number | null | undefined
): T[] {
  if (!config.order || !config.key) return data;

  const key = config.key as SortKey;
  const copy = [...data];

  copy.sort((a, b) => {
    const aVal = accessor(a, key);
    const bVal = accessor(b, key);

    const aNum = typeof aVal === "string" ? Number(aVal) : (aVal as number);
    const bNum = typeof bVal === "string" ? Number(bVal) : (bVal as number);

    const bothNumbers =
      !Number.isNaN(aNum as number) && !Number.isNaN(bNum as number);

    if (bothNumbers) {
      return (aNum as number) - (bNum as number);
    }

    const aStr = (aVal ?? "").toString();
    const bStr = (bVal ?? "").toString();
    return aStr.localeCompare(bStr, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  return config.order === "asc" ? copy : copy.reverse();
}

export function useSort<SortKey extends string>() {
  const [sortConfig, setSortConfig] = useState<SortConfig<SortKey>>({
    key: "" as SortKey,
    order: null,
  });

  const toggleSort = (key: SortKey) =>
    setSortConfig((prev: SortConfig<SortKey>) => getNextSortConfig(prev, key));

  const sortData = <T>(
    data: T[],
    accessor: (item: T, key: SortKey) => string | number | null | undefined
  ) => sortByConfig(data, sortConfig, accessor);

  return { sortConfig, toggleSort, sortData };
}
