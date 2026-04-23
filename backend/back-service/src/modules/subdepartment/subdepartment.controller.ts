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

  @SkipAuth()
  @Post()
  async create(
    @Body() data: CreateSubdepartmentDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const userEmailId = (req.headers.emailId as string) || null;
    const result = await this.subdepartmentService.createSubdepartment(
      data,
      userEmailId,
    );
    return baseController.getResult(
      res,
      201,
      result,
      'Subdepartment created successfully',
    );
  }

  @SkipAuth()
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

  @SkipAuth()
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

  @SkipAuth()
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubdepartmentDto: UpdateSubdepartmentDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const userEmailId = (req.headers.emailId as string) || null;
    const result = await this.subdepartmentService.updateSubdepartment(
      id,
      updateSubdepartmentDto,
      userEmailId,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Subdepartment updated successfully',
    );
  }

  @SkipAuth()
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubdepartmentStatusDto: UpdateSubdepartmentStatusDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    if (req.headers.emailId) {
      updateSubdepartmentStatusDto.updated_by = req.headers.emailId as string;
    }
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

  @SkipAuth()
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
