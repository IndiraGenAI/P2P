import { SkipAuth } from '@core/guards/role.guard';
import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
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

  @SkipAuth()
  @Post()
  async save(
    @Body() dto: SaveRolePermissionsDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    if (dto.created_by === undefined || dto.created_by === null) {
      const headerUserId = req.headers.userId as string | undefined;
      const parsed = headerUserId ? Number(headerUserId) : Number.NaN;
      if (Number.isFinite(parsed) && parsed > 0) {
        dto.created_by = parsed;
      }
    }
    const result = await this.rolePermissionsService.save(dto);
    return baseController.getResult(
      res,
      201,
      result,
      'Role permissions saved successfully',
    );
  }
}
