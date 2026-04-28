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
import { UomService } from './uom.service';
import { CreateUomDto } from './dto/create-uom.dto';
import { GetUomFilterDto } from './dto/uom-filter.dto';
import { UpdateUomDto } from './dto/update-uom.dto';
import { UpdateUomStatusDto } from './dto/update-status.dto';

@ApiTags('UOM')
@ApiBearerAuth()
@Controller('uom')
export class UomController {
  constructor(private readonly service: UomService) {}

  @Role('MASTER_UOM_CREATE')
  @Post()
  async create(
    @Body() data: CreateUomDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.create(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'UOM created successfully',
    );
  }

  @Role('MASTER_UOM_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetUomFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAll(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'UOMs fetched successfully',
    );
  }

  @Role('MASTER_UOM_VIEW')
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
      'UOM fetched successfully',
    );
  }

  @Role('MASTER_UOM_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUomDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.update(id, updateDto, req.user.email);
    return baseController.getResult(
      res,
      200,
      result,
      'UOM updated successfully',
    );
  }

  @Role('MASTER_UOM_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateUomStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateStatus(id, updateStatusDto);
    return baseController.getResult(
      res,
      200,
      result,
      'UOM status updated successfully',
    );
  }

  @Role('MASTER_UOM_DELETE')
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
      'UOM deleted successfully',
    );
  }
}
