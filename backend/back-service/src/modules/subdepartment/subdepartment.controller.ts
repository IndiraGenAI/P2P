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
import { SubdepartmentService } from './subdepartment.service';
import { CreateSubdepartmentDto } from './dto/create-subdepartment.dto';
import { GetSubdepartmentFilterDto } from './dto/subdepartment-filter.dto';
import { UpdateSubdepartmentDto } from './dto/update-subdepartment.dto';
import { UpdateSubdepartmentStatusDto } from './dto/update-status.dto';

@ApiTags('Subdepartment')
@ApiBearerAuth()
@Controller('subdepartment')
export class SubdepartmentController {
  constructor(private readonly subdepartmentService: SubdepartmentService) {}

  @Role('MASTER_SUBDEPARTMENT_CREATE')
  @Post()
  async create(
    @Body() data: CreateSubdepartmentDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.subdepartmentService.createSubdepartment(
      data,
      req.user.email,
    );
    return baseController.getResult(
      res,
      201,
      result,
      'Subdepartment created successfully',
    );
  }

  @Role('MASTER_SUBDEPARTMENT_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetSubdepartmentFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.subdepartmentService.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Subdepartments fetched successfully',
    );
  }

  @Role('MASTER_SUBDEPARTMENT_VIEW')
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.subdepartmentService.findOne(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Subdepartment fetched successfully',
    );
  }

  @Role('MASTER_SUBDEPARTMENT_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubdepartmentDto: UpdateSubdepartmentDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.subdepartmentService.updateSubdepartment(
      id,
      updateSubdepartmentDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Subdepartment updated successfully',
    );
  }

  @Role('MASTER_SUBDEPARTMENT_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubdepartmentStatusDto: UpdateSubdepartmentStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateSubdepartmentStatusDto.updated_by = req.user.email;
    const result = await this.subdepartmentService.updateSubdepartmentStatus(
      id,
      updateSubdepartmentStatusDto,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Subdepartment status updated successfully',
    );
  }

  @Role('MASTER_SUBDEPARTMENT_DELETE')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.subdepartmentService.remove(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Subdepartment deleted successfully',
    );
  }
}
