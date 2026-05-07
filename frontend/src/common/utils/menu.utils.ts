import type { MenuItem } from '@/common/models';
import type { AppAbility } from '@/ability';

/** Respects `item.end` so `/rate-contract` does not match `/rate-contract/grn`. */
export function menuPathMatches(item: MenuItem, pathname: string): boolean {
  if (!item.to) return false;
  if (pathname === item.to) return true;
  if (item.end === true) return false;
  return pathname.startsWith(item.to + '/');
}

export function canShowMenuItem(
  item: MenuItem,
  ability: AppAbility,
  isCode: string[],
): boolean {
  if (item.children?.length) {
    return item.children.some((child) => canShowMenuItem(child, ability, isCode));
  }
  if (!item.pageCode) return true;
  const action = item.action ?? 'VIEW';
  return ability.can(action, item.pageCode) && isCode.includes(item.pageCode);
}

export function filterMenuTree(
  items: MenuItem[],
  ability: AppAbility,
  isCode: string[],
): MenuItem[] {
  return items
    .filter((item) => canShowMenuItem(item, ability, isCode))
    .map((item) =>
      item.children?.length
        ? {
            ...item,
            children: filterMenuTree(item.children, ability, isCode),
          }
        : item,
    );
}
