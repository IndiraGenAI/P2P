



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

const DEV_JWT_SECRET = 'dev-only-change-me-set-JWT_SECRET-in-env';

const resolveJwtSecret = (mode: AppMode): string => {
  const fromEnv = process.env.JWT_SECRET?.trim();
  if (fromEnv && fromEnv.length >= 32) return fromEnv;

  if (mode !== 'DEV') {
    throw new Error(
      '[FATAL] JWT_SECRET must be set to a strong (>= 32 char) value when MODE != DEV. ' +
        'Refusing to start with a weak/default secret.',
    );
  }
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEV_JWT_SECRET;
};

const mode = readMode(process.env.MODE, 'DEV');

export const APP_ENV = {
  mode,
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
    secret: resolveJwtSecret(mode),
    expiresIn: readString(process.env.JWT_EXPIRES_IN, '12h'),
  },

  cors: {
    origins: readString(process.env.CORS_ORIGINS, '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  },

  isDev: () => mode === 'DEV',
  isProd: () => mode === 'PROD',
} as const;

export type AppEnv = typeof APP_ENV;
