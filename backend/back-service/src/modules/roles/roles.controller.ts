import { SkipAuth } from '@core/guards/role.guard';
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
import { Request, Response } from 'express';
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

  @SkipAuth()
  @Post()
  async create(
    @Body() data: CreateRoleDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const userEmailId = (req.headers.emailId as string) || null;
    const result = await this.rolesService.createRole(data, userEmailId);
    return baseController.getResult(
      res,
      201,
      result,
      'Role created successfully',
    );
  }

  @SkipAuth()
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

  @SkipAuth()
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

  @SkipAuth()
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

  @SkipAuth()
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const userEmailId = (req.headers.emailId as string) || null;
    const result = await this.rolesService.updateRole(
      id,
      updateRoleDto,
      userEmailId,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Role updated successfully',
    );
  }

  @SkipAuth()
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleStatusDto: UpdateRoleStatusDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    if (req.headers.emailId) {
      updateRoleStatusDto.updated_by = req.headers.emailId as string;
    }
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

  @SkipAuth()
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
