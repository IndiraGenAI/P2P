import { AuthModule } from './auth/auth.module';

/**
 * Register your business modules here. `AuthModule` is included by default so
 * the JWT auth + login/register endpoints work out of the box. Add new modules
 * to this array as you build them under `src/modules/<your-module>/`.
 */
export const ApplicationModules = [AuthModule];
