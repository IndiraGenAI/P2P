import { Role } from '@core/guards/role.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Put,
  Query,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { baseController } from 'src/core/baseController';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { GetDepartmentFilterDto } from './dto/department-filter.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { UpdateDepartmentStatusDto } from './dto/update-status.dto';

@ApiHeader({
  name: 'userRoleId',
  description: 'Set User Role ID',
  required: true,
})
@ApiTags('Departments')
@ApiBearerAuth()
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Role('DEPARTMENT_CREATE')
  @Post()
  async create(
    @Body() data: CreateDepartmentDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    let userEmailId: string | null;
    if (req.headers.emailId) {
      userEmailId = req.headers.emailId as string;
    }
    const result = await this.departmentsService.createDepartment(
      data,
      userEmailId,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Department Created Successfully',
    );
  }

  @Role(
    'DEPARTMENT_VIEW',
    'SUBDEPARTMENT_VIEW',
    'PACKAGE_VIEW',
    'COURSE_VIEW',
    'EXPENSE_MASTER_VIEW',
    'ADMISSION_VIEW',
    'USER_VIEW',
    'EXPENSE_VIEW',
  )
  @Get()
  async findAll(
    @Query() filterDto: GetDepartmentFilterDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    if (req.headers.branchIds) {
      filterDto.branchIds = req.headers.branchIds;
    }
    const result = await this.departmentsService.getDepartmentWithFilter(
      filterDto,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Departments Fetched Successfully',
    );
  }

  @Role(
    'DEPARTMENT_VIEW',
    'SUBDEPARTMENT_VIEW',
    'PACKAGE_VIEW',
    'COURSE_VIEW',
    'EXPENSE_MASTER_VIEW',
  )
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.departmentsService.findOne(+id);
    return baseController.getResult(
      res,
      200,
      result,
      'Department Fetched Successfully',
    );
  }

  @Role('DEPARTMENT_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    updateDepartmentDto.id = +id;
    let userEmailId: string | null;
    if (req.headers.emailId) {
      userEmailId = req.headers.emailId as string;
    }
    const result = await this.departmentsService.updateDepartment(
      updateDepartmentDto,
      userEmailId,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Department Updated Successfully',
    );
  }

  @Role('DEPARTMENT_DELETE')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.departmentsService.remove(+id);
    return baseController.getResult(
      res,
      200,
      result,
      'Department Deleted Successfully',
    );
  }

  @Role('DEPARTMENT_UPDATE')
  @Patch(':id/status')
  async updateDepartmentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentStatusDto: UpdateDepartmentStatusDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    if (req.headers.emailId) {
      updateDepartmentStatusDto.updated_by = req.headers.emailId as string;
    }
    const result = await this.departmentsService.updateDepartmentStatus(
      id,
      updateDepartmentStatusDto,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Department Status Updated Successfully',
    );
  }
}
