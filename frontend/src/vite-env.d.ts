/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API_BASE_URL: string;
  readonly MAIN_API_BASE_URL: string;
  readonly API_TIMEOUT: string;
  readonly APP_NAME: string;
  readonly APP_TAGLINE: string;
  readonly ENABLE_DEVTOOLS: string;
  readonly GOOGLE_MAPS_API_KEY: string;
  readonly S3_PUBLIC_BUCKET: string;
  readonly S3_PUBLIC_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
