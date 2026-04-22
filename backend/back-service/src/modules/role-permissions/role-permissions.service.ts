import { Injectable } from '@nestjs/common';
import { SaveRolePermissionsDto } from './dto/save-role-permissions.dto';
import { RolePermissionsRepository } from './role-permissions.repository';

@Injectable()
export class RolePermissionsService {


  async save(dto: SaveRolePermissionsDto): Promise<{ success: boolean }> {
    const result = await RolePermissionsRepository.query(
      `SELECT assign_role_permissions($1, $2::int[], $3) AS success`,
      [dto.role_id, dto.page_action_ids ?? [], dto.created_by ?? null],
    );
    return { success: !!result?.[0]?.success };
  }
}
