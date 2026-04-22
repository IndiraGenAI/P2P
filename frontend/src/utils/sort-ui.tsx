import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { SortConfig } from "./sort";

export const createSortHelpers = <SortKey extends string>(
  sort: SortConfig<SortKey>
) => ({
  getTooltip: (colKey: SortKey) => {
    const isActive = sort.key === colKey && !!sort.order;
    return !isActive
      ? "Click to sort ascending"
      : sort.order === "asc"
      ? "Click to sort descending"
      : "Click to clear sorting";
  },

  getClassName: (colKey: SortKey, base = "") =>
    [
      base,
      "sortable",
      sort.key === colKey && sort.order ? "active" : "",
      sort.key === colKey && sort.order === "asc" ? "asc" : "",
      sort.key === colKey && sort.order === "desc" ? "desc" : "",
    ]
      .filter(Boolean)
      .join(" "),

  getAriaSort: (colKey: SortKey) =>
    sort.key !== colKey || !sort.order
      ? "none"
      : sort.order === "asc"
      ? "ascending"
      : "descending",

  Icon: ({ colKey }: { colKey: SortKey }) => (
    <span className="sort-icon">
      {sort.key !== colKey || !sort.order ? (
        <>
          <CaretUpOutlined className="muted up" />
          <CaretDownOutlined className="muted down" />
        </>
      ) : (
        <>
          <CaretUpOutlined
            className={sort.order === "asc" ? "active up" : "muted up"}
          />
          <CaretDownOutlined
            className={sort.order === "desc" ? "active down" : "muted down"}
          />
        </>
      )}
    </span>
  ),
});

export const getSortTooltip = <SortKey extends string>(
  colKey: SortKey,
  sort: SortConfig<SortKey>
) => createSortHelpers(sort).getTooltip(colKey);

export const getThClassName = <SortKey extends string>(
  colKey: SortKey,
  sort: SortConfig<SortKey>,
  base?: string
) => createSortHelpers(sort).getClassName(colKey, base);

export const getAriaSort = <SortKey extends string>(
  colKey: SortKey,
  sort: SortConfig<SortKey>
) => createSortHelpers(sort).getAriaSort(colKey);

export const SortIcon = <SortKey extends string>({
  colKey,
  sort,
}: {
  colKey: SortKey;
  sort: SortConfig<SortKey>;
}) => createSortHelpers(sort).Icon({ colKey });

export default SortIcon;
