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
import { CoaCategoryService } from './coa-category.service';
import { CreateCoaCategoryDto } from './dto/create-coa-category.dto';
import { GetCoaCategoryFilterDto } from './dto/coa-category-filter.dto';
import { UpdateCoaCategoryDto } from './dto/update-coa-category.dto';
import { UpdateCoaCategoryStatusDto } from './dto/update-status.dto';

@ApiTags('COA Category')
@ApiBearerAuth()
@Controller('coa-category')
export class CoaCategoryController {
  constructor(private readonly service: CoaCategoryService) {}

  @Role('MASTER_COA_CATEGORY_CREATE')
  @Post()
  async create(
    @Body() data: CreateCoaCategoryDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.createCoaCategory(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'COA category created successfully',
    );
  }

  @Role('MASTER_COA_CATEGORY_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetCoaCategoryFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'COA categories fetched successfully',
    );
  }

  @Role('MASTER_COA_CATEGORY_VIEW')
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findOne(id);
    return baseController.getResult(
      res,
      200,
      result,
      'COA category fetched successfully',
    );
  }

  @Role('MASTER_COA_CATEGORY_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCoaCategoryDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateCoaCategory(
      id,
      updateDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'COA category updated successfully',
    );
  }

  @Role('MASTER_COA_CATEGORY_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateCoaCategoryStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateStatus(id, updateStatusDto);
    return baseController.getResult(
      res,
      200,
      result,
      'COA category status updated successfully',
    );
  }

  @Role('MASTER_COA_CATEGORY_DELETE')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.remove(id);
    return baseController.getResult(
      res,
      200,
      result,
      'COA category deleted successfully',
    );
  }
}
