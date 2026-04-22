import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { Users, UserStatus } from 'erp-db';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserFilterDto } from './dto/user-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UsersRepository } from './users.repository';

interface UserRoleSummary {
  id: number;
  name: string;
}

export interface UserWithRoles extends Users {
  roles: UserRoleSummary[];
}

interface UserListResponse {
  rows: UserWithRoles[];
  count: number;
}

const BCRYPT_ROUNDS = 10;

const stripHash = (user: Users): Users => {
  // Never leak the password hash to API clients.
  const { hash: _hash, ...rest } = user;
  return rest as Users;
};

interface UserRoleJoinRow {
  user_id: number;
  id: number;
  name: string;
}

/**
 * Loads the role assignments for the supplied user ids in a single query and
 * returns a `Map<userId, roles[]>` so callers can stitch the relation onto
 * `Users` rows without per-user round-trips.
 */
const loadRolesForUsers = async (
  userIds: number[],
): Promise<Map<number, UserRoleSummary[]>> => {
  const map = new Map<number, UserRoleSummary[]>();
  if (userIds.length === 0) {
    return map;
  }
  const rows: UserRoleJoinRow[] = await UsersRepository.query(
    `SELECT ur.user_id, r.id, r.name
       FROM user_roles ur
       INNER JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = ANY($1::int[])
      ORDER BY r.name ASC`,
    [userIds],
  );
  for (const row of rows) {
    const list = map.get(row.user_id) ?? [];
    list.push({ id: row.id, name: row.name });
    map.set(row.user_id, list);
  }
  return map;
};

const attachRoles = (
  user: Users,
  roleMap: Map<number, UserRoleSummary[]>,
): UserWithRoles => ({
  ...user,
  roles: roleMap.get(user.id) ?? [],
});

@Injectable()
export class UsersService {
  async createUser(
    createUserDto: CreateUserDto,
    userEmailId: string | null,
  ): Promise<UserWithRoles> {
    const email = createUserDto.email?.trim().toLowerCase();
    if (!email) {
      throw new ConflictException('Email is required');
    }

    const existing = await UsersRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException(
        `User with email "${email}" already exists`,
      );
    }

    const hash = await bcrypt.hash(createUserDto.password, BCRYPT_ROUNDS);

    const user = UsersRepository.create({
      first_name: createUserDto.first_name?.trim(),
      last_name: createUserDto.last_name?.trim(),
      email,
      hash,
      phone: createUserDto.phone?.trim(),
      status: createUserDto.status ?? UserStatus.PENDING,
      created_by: userEmailId ?? createUserDto.created_by ?? null,
    });

    const saved = await UsersRepository.save(user);

    if (createUserDto.role_ids !== undefined) {
      await this.assignUserRoles(saved.id, createUserDto.role_ids, userEmailId);
    }

    const roleMap = await loadRolesForUsers([saved.id]);
    return attachRoles(stripHash(saved), roleMap);
  }

  async findAllWithFilter(
    filterDto: GetUserFilterDto,
  ): Promise<PageDto<UserWithRoles> | UserListResponse> {
    const { first_name, last_name, email, phone, status, orderBy, order } =
      filterDto;

    const query = UsersRepository.createQueryBuilder('users').select([
      'users.id',
      'users.first_name',
      'users.last_name',
      'users.email',
      'users.phone',
      'users.status',
      'users.last_seen',
      'users.created_date',
      'users.modified_date',
      'users.created_by',
      'users.updated_by',
    ]);

    if (first_name) {
      query.andWhere('LOWER(users.first_name) LIKE LOWER(:first_name)', {
        first_name: `%${first_name}%`,
      });
    }

    if (last_name) {
      query.andWhere('LOWER(users.last_name) LIKE LOWER(:last_name)', {
        last_name: `%${last_name}%`,
      });
    }

    if (email) {
      query.andWhere('LOWER(users.email) LIKE LOWER(:email)', {
        email: `%${email}%`,
      });
    }

    if (phone) {
      query.andWhere('users.phone LIKE :phone', { phone: `%${phone}%` });
    }

    if (status) {
      query.andWhere('users.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`users.${sortColumn}`, order);

    if (String(filterDto.noLimit) === 'true') {
      const [rows, count] = await query.getManyAndCount();
      const roleMap = await loadRolesForUsers(rows.map((u) => u.id));
      return {
        rows: rows.map((u) => attachRoles(u, roleMap)),
        count,
      };
    }

    query.skip(filterDto.skip).take(filterDto.take);
    const itemCount = await query.getCount();
    const { entities } = await query.getRawAndEntities();

    const roleMap = await loadRolesForUsers(entities.map((u) => u.id));
    const withRoles = entities.map((u) => attachRoles(u, roleMap));

    const pageOptionsDto: PageOptionsDto = {
      take: filterDto.take,
      createdDate: new Date(),
      order: filterDto.order,
      skip: filterDto.skip,
    } as PageOptionsDto;
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(withRoles, pageMetaDto);
  }

  async findOne(id: number): Promise<UserWithRoles> {
    const user = await UsersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const roleMap = await loadRolesForUsers([id]);
    return attachRoles(stripHash(user), roleMap);
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    userEmailId: string | null,
  ): Promise<UserWithRoles> {
    const user = await UsersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email) {
      const newEmail = updateUserDto.email.trim().toLowerCase();
      if (newEmail !== user.email) {
        const conflict = await UsersRepository.findOne({
          where: { email: newEmail },
        });
        if (conflict && conflict.id !== id) {
          throw new ConflictException(
            `User with email "${newEmail}" already exists`,
          );
        }
        user.email = newEmail;
      }
    }

    if (updateUserDto.first_name !== undefined) {
      user.first_name = updateUserDto.first_name.trim();
    }
    if (updateUserDto.last_name !== undefined) {
      user.last_name = updateUserDto.last_name.trim();
    }
    if (updateUserDto.phone !== undefined) {
      user.phone = updateUserDto.phone.trim();
    }
    if (updateUserDto.status !== undefined) {
      user.status = updateUserDto.status;
    }
    if (updateUserDto.password) {
      user.hash = await bcrypt.hash(updateUserDto.password, BCRYPT_ROUNDS);
    }

    user.updated_by = userEmailId ?? updateUserDto.updated_by ?? null;
    user.modified_date = new Date();

    const saved = await UsersRepository.save(user);

    if (updateUserDto.role_ids !== undefined) {
      await this.assignUserRoles(saved.id, updateUserDto.role_ids, userEmailId);
    }

    const roleMap = await loadRolesForUsers([saved.id]);
    return attachRoles(stripHash(saved), roleMap);
  }

  /**
   * Replace the user's role assignments with the supplied list. Delegates to
   * the `assign_user_roles` Postgres function so the delete + insert run
   * atomically inside the database (mirrors `assign_role_permissions`).
   *
   * NOTE: the explicit `::int` / `::text` casts on the placeholders are
   * required because `pg` sends bound params as `unknown` and Postgres
   * cannot implicitly resolve `unknown -> varchar(N)`. Casting here makes
   * the call resilient even if the function signature changes later.
   */
  private async assignUserRoles(
    userId: number,
    roleIds: number[],
    userEmailId: string | null,
  ): Promise<void> {
    await UsersRepository.query(
      `SELECT assign_user_roles($1::int, $2::int[], $3::text) AS success`,
      [userId, roleIds ?? [], userEmailId],
    );
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await UsersRepository.delete({ id });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('User not found');
  }

  async updateUserStatus(
    id: number,
    updateUserStatusDto: UpdateUserStatusDto,
  ): Promise<UpdateResult> {
    const result = await UsersRepository.update(id, {
      status: updateUserStatusDto.status,
      updated_by: updateUserStatusDto.updated_by ?? null,
      modified_date: new Date(),
    });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('User not found');
  }
}
