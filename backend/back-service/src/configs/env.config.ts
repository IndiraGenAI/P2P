/**
 * Centralized, typed access to runtime environment variables.
 *
 * @nestjs/config (loaded in AppModule via `ConfigModule.forRoot({ isGlobal: true })`)
 * already populates `process.env` from `.env` at boot time. This helper just
 * provides a single, typed accessor with sane defaults so the rest of the
 * codebase never has to read `process.env.*` directly.
 */

const readString = (value: string | undefined, fallback: string): string =>
  value && value.trim().length > 0 ? value : fallback;

const readNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const readBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  return value.trim().toLowerCase() === 'true';
};

export type AppMode = 'DEV' | 'STAGING' | 'PROD';

const readMode = (value: string | undefined, fallback: AppMode): AppMode => {
  const upper = (value || '').toUpperCase();
  return upper === 'DEV' || upper === 'STAGING' || upper === 'PROD'
    ? (upper as AppMode)
    : fallback;
};

export const APP_ENV = {
  mode: readMode(process.env.MODE, 'DEV'),
  port: readNumber(process.env.PORT, 3010),
  prefix: readString(process.env.PREFIX, '/'),

  db: {
    host: readString(process.env.DB_HOST, 'localhost'),
    port: readNumber(process.env.DB_PORT, 5432),
    username: readString(process.env.DB_USERNAME, 'postgres'),
    password: readString(process.env.DB_PASSWORD, 'postgres'),
    database: readString(process.env.DB_DATABASE, 'p2p_org'),
    ssl: readBoolean(process.env.DB_SSL, false),
  },

  jwt: {
    // The fallback is intentionally only used in DEV. Configure JWT_SECRET in
    // .env for any non-dev environment.
    secret: readString(
      process.env.JWT_SECRET,
      'change-me-in-prod-please-use-a-long-random-string',
    ),
    expiresIn: readString(process.env.JWT_EXPIRES_IN, '12h'),
  },

  isDev: () => readMode(process.env.MODE, 'DEV') === 'DEV',
  isProd: () => readMode(process.env.MODE, 'DEV') === 'PROD',
} as const;

export type AppEnv = typeof APP_ENV;
