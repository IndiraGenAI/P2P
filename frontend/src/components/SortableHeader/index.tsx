import { Tooltip } from "antd";
import { createSortHelpers } from "src/utils/sort-ui";
import { SortableHeaderProps } from "./SortableHeader.model";

export function SortableHeader<SortKey extends string = string>({
  colKey,
  sortConfig,
  onSort,
  children,
  className = "",
  style = {}
}: SortableHeaderProps<SortKey>) {
  const helpers = createSortHelpers(sortConfig);
  
  return (
    <th
      className={helpers.getClassName(colKey, className)}
      style={{ cursor: "pointer", ...style }}
      onClick={() => onSort(colKey)}
      aria-sort={helpers.getAriaSort(colKey)}
    >
      <Tooltip title={helpers.getTooltip(colKey)}>
        <span>
          {children} {helpers.Icon({ colKey })}
        </span>
      </Tooltip>
    </th>
  );
}

export default SortableHeader;
