import { CanActivate, Injectable, SetMetadata } from '@nestjs/common';

/**
 * NOTE: temporary no-op guard.
 *
 * The original implementation pulled in `commons/helper` (which depends on
 * `@modules/branches` and `@modules/zones`, neither of which were ported into
 * this project). Until the auth wiring is finalised, this guard simply allows
 * every request through so the rest of the API can boot. Replace with the
 * real auth/role-based check once the user-permissions stack is in place.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}

export const Role = (...roles: string[]) => SetMetadata('roles', roles);
export const SkipAuth = () => SetMetadata('skipAuth', true);
