export const RoleType = {
  SuperAdmin: 'SUPER_ADMIN',
  Manager: 'MANAGER',
  Purchaser: 'PURCHASER',
  Finance: 'FINANCE',
} as const;

export type RoleType = (typeof RoleType)[keyof typeof RoleType];

export const ROLE_TYPE_LABELS: Record<RoleType, string> = {
  [RoleType.SuperAdmin]: 'Super Admin',
  [RoleType.Manager]: 'Manager',
  [RoleType.Purchaser]: 'Purchaser',
  [RoleType.Finance]: 'Finance',
};
