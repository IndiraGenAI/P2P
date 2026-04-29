



const readString = (value: string | undefined, fallback: string): string =>
  value && value.trim().length > 0 ? value : fallback;

const readNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const readBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
};

const env = import.meta.env;

export const ENV = {
  api: {
    baseUrl: readString(env.API_BASE_URL, 'http://localhost:3010/bs'),
    mainBaseUrl: readString(
      env.MAIN_API_BASE_URL,
      'http://localhost:3011/ms',
    ),
    timeoutMs: readNumber(env.API_TIMEOUT, 30000),
  },
  app: {
    name: readString(env.APP_NAME, 'P2P-ORG'),
    tagline: readString(env.APP_TAGLINE, 'Procure-to-Pay'),
  },
  aws: {
    s3PublicBucket: readString(env.S3_PUBLIC_BUCKET, ''),
    s3PublicBaseUrl: readString(env.S3_PUBLIC_BASE_URL, ''),
  },
  google: {
    mapsApiKey: readString(env.GOOGLE_MAPS_API_KEY, ''),
  },
  features: {
    devtoolsEnabled: readBoolean(env.ENABLE_DEVTOOLS, false),
  },
  isDev: env.DEV,
  isProd: env.PROD,
} as const;

export type AppEnv = typeof ENV;
