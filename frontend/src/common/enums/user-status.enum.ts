export const UserStatus = {
  Hired: 'Hired',
  Pending: 'Pending',
  Inactive: 'Inactive',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
