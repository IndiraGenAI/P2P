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
import { ItemTypeService } from './item-type.service';
import { CreateItemTypeDto } from './dto/create-item-type.dto';
import { GetItemTypeFilterDto } from './dto/item-type-filter.dto';
import { UpdateItemTypeDto } from './dto/update-item-type.dto';
import { UpdateItemTypeStatusDto } from './dto/update-status.dto';

@ApiTags('Item Type')
@ApiBearerAuth()
@Controller('item-type')
export class ItemTypeController {
  constructor(private readonly service: ItemTypeService) {}

  @Role('MASTER_ITEM_TYPE_CREATE')
  @Post()
  async create(
    @Body() data: CreateItemTypeDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.create(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Item type created successfully',
    );
  }

  @Role(
    'MASTER_ITEM_TYPE_VIEW',
    'PROCUREMENT_PURCHASE_REQUEST_CREATE',
    'PROCUREMENT_PURCHASE_REQUEST_VIEW',
    'PROCUREMENT_PURCHASE_REQUEST_UPDATE',
  )
  @Get()
  async findAll(
    @Query() filterDto: GetItemTypeFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAll(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Item types fetched successfully',
    );
  }

  @Role(
    'MASTER_ITEM_TYPE_VIEW',
    'PROCUREMENT_PURCHASE_REQUEST_CREATE',
    'PROCUREMENT_PURCHASE_REQUEST_VIEW',
    'PROCUREMENT_PURCHASE_REQUEST_UPDATE',
  )
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
      'Item type fetched successfully',
    );
  }

  @Role('MASTER_ITEM_TYPE_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateItemTypeDto,
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
      'Item type updated successfully',
    );
  }

  @Role('MASTER_ITEM_TYPE_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateItemTypeStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateStatus(id, updateStatusDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Item type status updated successfully',
    );
  }

  @Role('MASTER_ITEM_TYPE_DELETE')
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
      'Item type deleted successfully',
    );
  }
}
