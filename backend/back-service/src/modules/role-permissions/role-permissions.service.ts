import { Injectable } from '@nestjs/common';
import { SaveRolePermissionsDto } from './dto/save-role-permissions.dto';
import { RolePermissionsRepository } from './role-permissions.repository';

@Injectable()
export class RolePermissionsService {
  /**
   * Replace the role's permissions with the supplied page_action_ids list.
   * Delegates to the `assign_role_permissions` Postgres function so the
   * delete + insert run atomically inside the database.
   */
  async save(dto: SaveRolePermissionsDto): Promise<{ success: boolean }> {
    const result = await RolePermissionsRepository.query(
      `SELECT assign_role_permissions($1, $2::int[], $3) AS success`,
      [dto.role_id, dto.page_action_ids ?? [], dto.created_by ?? null],
    );
    return { success: !!result?.[0]?.success };
  }
}
