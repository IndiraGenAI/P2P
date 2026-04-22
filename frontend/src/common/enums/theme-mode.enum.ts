export const ThemeMode = {
  Light: 'light',
  Dark: 'dark',
} as const;

export type ThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode];
