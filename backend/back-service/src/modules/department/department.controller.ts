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
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { GetDepartmentFilterDto } from './dto/department-filter.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { UpdateDepartmentStatusDto } from './dto/update-status.dto';

@ApiTags('Department')
@ApiBearerAuth()
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @SkipAuth()
  @Post()
  async create(
    @Body() data: CreateDepartmentDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const userEmailId = (req.headers.emailId as string) || null;
    const result = await this.departmentService.createDepartment(
      data,
      userEmailId,
    );
    return baseController.getResult(
      res,
      201,
      result,
      'Department created successfully',
    );
  }

  @SkipAuth()
  @Get()
  async findAll(
    @Query() filterDto: GetDepartmentFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.departmentService.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Departments fetched successfully',
    );
  }

  @SkipAuth()
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.departmentService.findOne(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Department fetched successfully',
    );
  }

  @SkipAuth()
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const userEmailId = (req.headers.emailId as string) || null;
    const result = await this.departmentService.updateDepartment(
      id,
      updateDepartmentDto,
      userEmailId,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Department updated successfully',
    );
  }

  @SkipAuth()
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentStatusDto: UpdateDepartmentStatusDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    if (req.headers.emailId) {
      updateDepartmentStatusDto.updated_by = req.headers.emailId as string;
    }
    const result = await this.departmentService.updateDepartmentStatus(
      id,
      updateDepartmentStatusDto,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Department status updated successfully',
    );
  }

  @SkipAuth()
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.departmentService.remove(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Department deleted successfully',
    );
  }
}
