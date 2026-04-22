import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
  type MongoQuery,
  type Subject,
} from '@casl/ability';

type PossibleAbilities = [string, Subject];
export type AppAbility = MongoAbility<PossibleAbilities, MongoQuery>;

export const ability: AppAbility = createMongoAbility();

export interface BackendRolePermission {
  page_action?: {
    page?: { page_code?: string };
    action?: { action_code?: string };
  };
}

export function convertAbility(rolePermissions?: BackendRolePermission[]) {
  const { can, rules } = new AbilityBuilder(createMongoAbility);
  rolePermissions?.forEach((rp) => {
    const action = rp?.page_action?.action?.action_code;
    const page = rp?.page_action?.page?.page_code;
    if (action && page) can(action, page);
  });
  return rules;
}

export function applyAbility(rolePermissions?: BackendRolePermission[]) {
  ability.update(convertAbility(rolePermissions));
}

export function pageCodesFrom(rolePermissions?: BackendRolePermission[]): string[] {
  const set = new Set<string>();
  rolePermissions?.forEach((rp) => {
    const code = rp?.page_action?.page?.page_code;
    if (code) set.add(code);
  });
  return [...set];
}

export function grantAllAbility() {
  const { can, rules } = new AbilityBuilder(createMongoAbility);
  can('manage', 'all');
  ability.update(rules);
}
