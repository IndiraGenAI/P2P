import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { dataSource } from '@core/data-source';

/**
 * Shape attached to `request.user` by `RolesGuard` once the bearer token is
 * verified. Controllers should read user identity / audit fields from here
 * instead of trusting client-supplied headers (`userId`, `userroleid`,
 * `emailId`, ...) which were trivially spoofable in the old design.
 */
export interface AuthenticatedRequestUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  permissions: string[];
}

export type AuthenticatedRequest = Request & {
  user: AuthenticatedRequestUser;
};

interface JwtPayload {
  sub: number;
  email: string;
}

interface UserPermissionRow {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  permissions: string[] | null;
}

const ROLES_KEY = 'roles';
const SKIP_AUTH_KEY = 'skipAuth';

/**
 * Global guard: every request must carry a valid JWT (`Authorization: Bearer
 * <token>`) unless the handler/class is decorated with `@SkipAuth()`. After
 * the JWT is verified the user's permission tags are loaded from the database
 * (single query joining user_roles -> role_permissions -> page_actions) and
 * stored on `request.user`. If the handler is decorated with `@Role(...tags)`
 * we additionally require that the user owns at least one of those tags.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) return true;

    const required = this.reflector.getAllAndOverride<string[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const rows = (await dataSource.query(
      `
        SELECT
          u.id,
          u.email,
          u.first_name,
          u.last_name,
          u.status,
          COALESCE(
            ARRAY(
              SELECT DISTINCT pa.tag
                FROM user_roles ur
                JOIN role_permissions rp ON rp.role_id = ur.role_id
                JOIN page_actions pa     ON pa.id = rp.page_action_id
               WHERE ur.user_id = u.id
            ),
            ARRAY[]::TEXT[]
          ) AS permissions
        FROM users u
        WHERE u.id = $1
        LIMIT 1
      `,
      [payload.sub],
    )) as UserPermissionRow[];

    const row = rows?.[0];
    if (!row) {
      throw new UnauthorizedException('User no longer exists');
    }
    if (row.status === 'DISABLE') {
      throw new UnauthorizedException('Account is disabled');
    }

    const user: AuthenticatedRequestUser = {
      id: row.id,
      email: row.email,
      first_name: row.first_name,
      last_name: row.last_name,
      status: row.status,
      permissions: row.permissions ?? [],
    };

    (request as AuthenticatedRequest).user = user;

    if (!required || required.length === 0) {
      return true;
    }

    const allowed = required.some((tag) => user.permissions.includes(tag));
    if (!allowed) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }
    return true;
  }

  private extractToken(request: Request): string | null {
    const header = request.headers?.authorization;
    if (!header || typeof header !== 'string') return null;
    const [scheme, value] = header.split(' ');
    if (!scheme || scheme.toLowerCase() !== 'bearer' || !value) return null;
    return value.trim();
  }
}

export const Role = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
export const SkipAuth = () => SetMetadata(SKIP_AUTH_KEY, true);
