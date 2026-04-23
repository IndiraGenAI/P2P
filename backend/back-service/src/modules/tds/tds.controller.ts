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
import { TdsService } from './tds.service';
import { CreateTdsDto } from './dto/create-tds.dto';
import { GetTdsFilterDto } from './dto/tds-filter.dto';
import { UpdateTdsDto } from './dto/update-tds.dto';
import { UpdateTdsStatusDto } from './dto/update-status.dto';

@ApiTags('TDS')
@ApiBearerAuth()
@Controller('tds')
export class TdsController {
  constructor(private readonly service: TdsService) {}

  @Role('MASTER_TDS_CREATE')
  @Post()
  async create(
    @Body() data: CreateTdsDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.createTds(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'TDS created successfully',
    );
  }

  @Role('MASTER_TDS_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetTdsFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'TDS records fetched successfully',
    );
  }

  @Role('MASTER_TDS_VIEW')
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
      'TDS fetched successfully',
    );
  }

  @Role('MASTER_TDS_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTdsDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateTds(
      id,
      updateDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'TDS updated successfully',
    );
  }

  @Role('MASTER_TDS_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateTdsStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateStatus(id, updateStatusDto);
    return baseController.getResult(
      res,
      200,
      result,
      'TDS status updated successfully',
    );
  }

  @Role('MASTER_TDS_DELETE')
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
      'TDS deleted successfully',
    );
  }
}
