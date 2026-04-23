import { Role } from '@core/guards/role.guard';
import type { AuthenticatedRequest } from '@core/guards/role.guard';
import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { baseController } from 'src/core/baseController';
import { SaveRolePermissionsDto } from './dto/save-role-permissions.dto';
import { RolePermissionsService } from './role-permissions.service';

@ApiTags('Role Permissions')
@ApiBearerAuth()
@Controller('role-permissions')
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  @Role('USERS_ROLES_ASSIGN_PERMISSION')
  @Post()
  async save(
    @Body() dto: SaveRolePermissionsDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    dto.created_by = req.user.id;
    const result = await this.rolePermissionsService.save(dto);
    return baseController.getResult(
      res,
      201,
      result,
      'Role permissions saved successfully',
    );
  }
}
