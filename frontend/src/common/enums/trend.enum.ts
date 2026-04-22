export const Trend = {
  Up: 'up',
  Down: 'down',
} as const;

export type Trend = (typeof Trend)[keyof typeof Trend];
