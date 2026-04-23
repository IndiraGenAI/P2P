import { Role } from '@core/guards/role.guard';
import type { AuthenticatedRequest } from '@core/guards/role.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { baseController } from 'src/core/baseController';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleFilterDto } from './dto/role-filter.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateRoleStatusDto } from './dto/update-status.dto';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Role('USERS_ROLES_CREATE')
  @Post()
  async create(
    @Body() data: CreateRoleDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.rolesService.createRole(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Role created successfully',
    );
  }

  @Role('USERS_ROLES_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetRoleFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.rolesService.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Roles fetched successfully',
    );
  }

  @Role('USERS_ROLES_VIEW')
  @Get('permissions/:id')
  async getPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.rolesService.getRolePermissionsById(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Role permissions fetched successfully',
    );
  }

  @Role('USERS_ROLES_VIEW')
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.rolesService.findOne(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Role fetched successfully',
    );
  }

  @Role('USERS_ROLES_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.rolesService.updateRole(
      id,
      updateRoleDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Role updated successfully',
    );
  }

  @Role('USERS_ROLES_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleStatusDto: UpdateRoleStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateRoleStatusDto.updated_by = req.user.email;
    const result = await this.rolesService.updateRoleStatus(
      id,
      updateRoleStatusDto,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Role status updated successfully',
    );
  }

  @Role('USERS_ROLES_DELETE')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.rolesService.remove(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Role deleted successfully',
    );
  }
}
