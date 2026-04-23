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
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserFilterDto } from './dto/user-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Role('USERS_USERS_CREATE')
  @Post()
  async create(
    @Body() data: CreateUserDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.usersService.createUser(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'User created successfully',
    );
  }

  @Role('USERS_USERS_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetUserFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.usersService.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Users fetched successfully',
    );
  }

  @Role('USERS_USERS_VIEW')
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.usersService.findOne(id);
    return baseController.getResult(
      res,
      200,
      result,
      'User fetched successfully',
    );
  }

  @Role('USERS_USERS_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.usersService.updateUser(
      id,
      updateUserDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'User updated successfully',
    );
  }

  @Role('USERS_USERS_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateUserStatusDto.updated_by = req.user.email;
    const result = await this.usersService.updateUserStatus(
      id,
      updateUserStatusDto,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'User status updated successfully',
    );
  }

  @Role('USERS_USERS_DELETE')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.usersService.remove(id);
    return baseController.getResult(
      res,
      200,
      result,
      'User deleted successfully',
    );
  }
}
