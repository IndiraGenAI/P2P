import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleFilterDto } from './dto/role-filter.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateRoleStatusDto } from './dto/update-status.dto';
import { Pages, Roles } from 'erp-db';
import { PagesRepository, RolesRepository } from './roles.repository';

interface RoleListResponse {
  rows: Roles[];
  count: number;
}

export interface RoleWithPermissions extends Roles {
  pages: Pages[];
}

const sortByAsc = <T>(arr: T[], pick: (item: T) => number | string): T[] =>
  [...arr].sort((a, b) => {
    const av = pick(a) ?? 0;
    const bv = pick(b) ?? 0;
    if (av < bv) return -1;
    if (av > bv) return 1;
    return 0;
  });

@Injectable()
export class RolesService {
  async createRole(
    createRoleDto: CreateRoleDto,
    userEmailId: string | null,
  ): Promise<Roles> {
    const name = createRoleDto.name?.trim();
    if (!name) {
      throw new ConflictException('Role name is required');
    }

    const existing = await RolesRepository.findOne({ where: { name } });
    if (existing) {
      throw new ConflictException(`Role with name "${name}" already exists`);
    }

    const role = RolesRepository.create({
      ...createRoleDto,
      name,
      status: createRoleDto.status ?? true,
      created_by: userEmailId ?? createRoleDto.created_by ?? null,
    });

    return RolesRepository.save(role);
  }

  async findAllWithFilter(
    filterDto: GetRoleFilterDto,
  ): Promise<PageDto<Roles> | RoleListResponse> {
    const { name, type, status, orderBy, order } = filterDto;

    const query = RolesRepository.createQueryBuilder('roles');

    if (name) {
      query.andWhere('LOWER(roles.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    if (type) {
      query.andWhere('roles.type = :type', { type });
    }

    if (status !== undefined && status !== null) {
      query.andWhere('roles.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`roles.${sortColumn}`, order);

    if (String(filterDto.noLimit) === 'true') {
      const [rows, count] = await query.getManyAndCount();
      return { rows, count };
    }

    query.skip(filterDto.skip).take(filterDto.take);
    const itemCount = await query.getCount();
    const { entities } = await query.getRawAndEntities();

    const pageOptionsDto: PageOptionsDto = {
      take: filterDto.take,
      createdDate: new Date(),
      order: filterDto.order,
      skip: filterDto.skip,
    } as PageOptionsDto;
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number): Promise<Roles> {
    const role = await RolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async updateRole(
    id: number,
    updateRoleDto: UpdateRoleDto,
    userEmailId: string | null,
  ): Promise<Roles> {
    const role = await RolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (updateRoleDto.name && updateRoleDto.name.trim() !== role.name) {
      const newName = updateRoleDto.name.trim();
      const conflict = await RolesRepository.findOne({
        where: { name: newName },
      });
      if (conflict && conflict.id !== id) {
        throw new ConflictException(
          `Role with name "${newName}" already exists`,
        );
      }
      role.name = newName;
    }

    if (updateRoleDto.description !== undefined) {
      role.description = updateRoleDto.description;
    }
    if (updateRoleDto.type !== undefined) {
      role.type = updateRoleDto.type;
    }
    if (updateRoleDto.status !== undefined) {
      role.status = updateRoleDto.status;
    }

    role.updated_by = userEmailId ?? updateRoleDto.updated_by ?? null;

    return RolesRepository.save(role);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await RolesRepository.delete({ id });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Role not found');
  }

  async updateRoleStatus(
    id: number,
    updateRoleStatusDto: UpdateRoleStatusDto,
  ): Promise<UpdateResult> {
    const result = await RolesRepository.update(id, updateRoleStatusDto);
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Role not found');
  }

  /**
   * Returns the role's data + its current role_permissions (so the UI can pre-
   * tick the assigned page_actions) + the full pages tree (each page including
   * its page_actions joined to actions). Ordering matches what the legacy WEB
   * permission screen expected: pages by `sequence`, page_actions by id.
   */
  async getRolePermissionsById(id: number): Promise<RoleWithPermissions> {
    const role = await RolesRepository.findOne({
      where: { id },
      relations: {
        role_permissions: {
          page_action: { action: true, page: true },
        },
      },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const pages = await PagesRepository.find({
      where: { active: true },
      relations: { page_actions: { action: true } },
    });

    pages.forEach((page) => {
      page.page_actions = sortByAsc(
        page.page_actions ?? [],
        (pa) => pa.action_id,
      );
    });
    const sortedPages = sortByAsc(
      pages,
      (page) => page.sequence ?? Number.MAX_SAFE_INTEGER,
    );

    return { ...role, pages: sortedPages };
  }
}
