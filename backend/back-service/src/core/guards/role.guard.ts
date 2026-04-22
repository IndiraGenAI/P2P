import { CanActivate, Injectable, SetMetadata } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}

export const Role = (...roles: string[]) => SetMetadata('roles', roles);
export const SkipAuth = () => SetMetadata('skipAuth', true);
