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

  @SkipAuth()
  @Post()
  async create(
    @Body() data: CreateUserDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const userEmailId = (req.headers.emailId as string) || null;
    const result = await this.usersService.createUser(data, userEmailId);
    return baseController.getResult(
      res,
      201,
      result,
      'User created successfully',
    );
  }

  @SkipAuth()
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

  @SkipAuth()
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

  @SkipAuth()
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const userEmailId = (req.headers.emailId as string) || null;
    const result = await this.usersService.updateUser(
      id,
      updateUserDto,
      userEmailId,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'User updated successfully',
    );
  }

  @SkipAuth()
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    if (req.headers.emailId) {
      updateUserStatusDto.updated_by = req.headers.emailId as string;
    }
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

  @SkipAuth()
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
