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
import { ItemCategoryService } from './item-category.service';
import { CreateItemCategoryDto } from './dto/create-item-category.dto';
import { GetItemCategoryFilterDto } from './dto/item-category-filter.dto';
import { UpdateItemCategoryDto } from './dto/update-item-category.dto';
import { UpdateItemCategoryStatusDto } from './dto/update-status.dto';

@ApiTags('Item Category')
@ApiBearerAuth()
@Controller('item-category')
export class ItemCategoryController {
  constructor(private readonly service: ItemCategoryService) {}

  @Role('MASTER_ITEM_CATEGORY_CREATE')
  @Post()
  async create(
    @Body() data: CreateItemCategoryDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.create(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Item category created successfully',
    );
  }

  @Role('MASTER_ITEM_CATEGORY_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetItemCategoryFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAll(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Item categories fetched successfully',
    );
  }

  @Role('MASTER_ITEM_CATEGORY_VIEW')
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
      'Item category fetched successfully',
    );
  }

  @Role('MASTER_ITEM_CATEGORY_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateItemCategoryDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.update(
      id,
      updateDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Item category updated successfully',
    );
  }

  @Role('MASTER_ITEM_CATEGORY_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateItemCategoryStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateStatus(id, updateStatusDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Item category status updated successfully',
    );
  }

  @Role('MASTER_ITEM_CATEGORY_DELETE')
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
      'Item category deleted successfully',
    );
  }
}
