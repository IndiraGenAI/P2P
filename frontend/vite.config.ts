import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      src: path.resolve(__dirname, './src'),
    },
  },
  // Expose env vars with these prefixes to the client. We drop Vite's
  // default `VITE_` prefix in favor of natural, domain-specific names
  // (API_, APP_, S3_, etc.). NEVER add backend-only / secret prefixes
  // here — anything matched gets shipped to the browser bundle.
  envPrefix: ['API_', 'MAIN_', 'APP_', 'ENABLE_', 'GOOGLE_', 'S3_'],
});
