import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Users, UserStatus } from 'erp-db';
import { APP_ENV } from '../../configs/env.config';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { JwtPayload } from './jwt.strategy';

const BCRYPT_ROUNDS = 10;

export interface AuthRolePermission {
  page_action: {
    id: number;
    tag: string;
    page: { id: number; page_code: string; name: string };
    action: { id: number; action_code: string; name: string };
  };
}

export interface AuthSafeUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: string;
  role_permissions?: AuthRolePermission[];
}

export interface AuthTokenPair {
  accessToken: string;
  expiresIn: string;
  user: AuthSafeUser;
}

const toSafeUser = (user: Users): AuthSafeUser => ({
  id: user.id,
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  phone: user.phone ?? null,
  status: user.status,
});

interface RolePermissionRow {
  pa_id: number;
  pa_tag: string;
  page_id: number;
  page_code: string;
  page_name: string;
  action_id: number;
  action_code: string;
  action_name: string;
}

/**
 * Fetch the flattened role_permissions for every role linked to a user.
 *
 * We use a raw SQL query rather than going through the `UserRoles` entity
 * because that entity (defined in `erp-db`) requires `zone_id`, `availability`
 * etc. that we have not seeded into the back-service schema yet. This keeps
 * `/auth/me` working as soon as a row exists in the lightweight `user_roles`
 * table created in `backend/db/database/table.sql`.
 */
const loadRolePermissionsForUser = async (
  userId: number,
): Promise<AuthRolePermission[]> => {
  const rows = await UsersRepository.query(
    `
      SELECT
        pa.id          AS pa_id,
        pa.tag         AS pa_tag,
        p.id           AS page_id,
        p.page_code    AS page_code,
        p.name         AS page_name,
        a.id           AS action_id,
        a.action_code  AS action_code,
        a.name         AS action_name
      FROM user_roles ur
      INNER JOIN role_permissions rp ON rp.role_id = ur.role_id
      INNER JOIN page_actions pa     ON pa.id = rp.page_action_id
      INNER JOIN pages p             ON p.id = pa.page_id
      INNER JOIN actions a           ON a.id = pa.action_id
      WHERE ur.user_id = $1
    `,
    [userId],
  );

  return (rows as RolePermissionRow[]).map((row) => ({
    page_action: {
      id: row.pa_id,
      tag: row.pa_tag,
      page: {
        id: row.page_id,
        page_code: row.page_code,
        name: row.page_name,
      },
      action: {
        id: row.action_id,
        action_code: row.action_code,
        name: row.action_name,
      },
    },
  }));
};

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private signFor(user: Users): AuthTokenPair {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      expiresIn: APP_ENV.jwt.expiresIn,
      user: toSafeUser(user),
    };
  }

  async register(dto: RegisterDto): Promise<AuthTokenPair> {
    const email = dto.email.trim().toLowerCase();

    const existing = await UsersRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException(
        `User with email "${email}" already exists`,
      );
    }

    const hash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = UsersRepository.create({
      first_name: dto.first_name.trim(),
      last_name: dto.last_name.trim(),
      email,
      hash,
      phone: dto.phone?.trim() ?? '',
      // Self-registered accounts go straight to ENABLE so the user can log in.
      // Tighten this to PENDING + an admin-approval flow later if needed.
      status: UserStatus.ENABLE,
      created_by: email,
    });

    const saved = await UsersRepository.save(user);
    return this.signFor(saved);
  }

  async login(dto: LoginDto): Promise<AuthTokenPair> {
    const email = dto.email.trim().toLowerCase();

    const user = await UsersRepository.findOne({
      where: { email },
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'hash',
        'phone',
        'status',
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === UserStatus.DISABLE) {
      throw new UnauthorizedException(
        'Your account has been disabled. Please contact your administrator.',
      );
    }
    if (user.status === UserStatus.PENDING) {
      throw new UnauthorizedException(
        'Your account is pending approval. Please contact your administrator.',
      );
    }

    const ok = await bcrypt.compare(dto.password, user.hash);
    if (!ok) {
      throw new UnauthorizedException('Invalid email or password');
    }

    user.last_seen = new Date();
    await UsersRepository.save(user);

    return this.signFor(user);
  }

  async getProfile(userId: number): Promise<AuthSafeUser> {
    const user = await UsersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    const safe = toSafeUser(user);
    try {
      safe.role_permissions = await loadRolePermissionsForUser(userId);
    } catch {
      // Tables may not exist yet (fresh DB). Treat as "no permissions" so the
      // app still boots and the user can see permission-free pages.
      safe.role_permissions = [];
    }
    return safe;
  }
}
