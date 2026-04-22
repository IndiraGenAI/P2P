/**
 * Centralized, typed access to runtime environment variables.
 *
 * All Vite env vars must be prefixed with `VITE_` to be exposed to the client.
 * Using this single object instead of `import.meta.env` directly gives us:
 *   - one place for defaults
 *   - one place for type coercion (string → number / boolean)
 *   - safer refactors (rename a key in one file, not 50)
 */

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
    baseUrl: readString(env.VITE_API_BASE_URL, 'http://localhost:3010/api'),
    timeoutMs: readNumber(env.VITE_API_TIMEOUT, 30000),
  },
  app: {
    name: readString(env.VITE_APP_NAME, 'P2P-ORG'),
    tagline: readString(env.VITE_APP_TAGLINE, 'Procure-to-Pay'),
  },
  features: {
    devtoolsEnabled: readBoolean(env.VITE_ENABLE_DEVTOOLS, false),
  },
  isDev: env.DEV,
  isProd: env.PROD,
} as const;

export type AppEnv = typeof ENV;
