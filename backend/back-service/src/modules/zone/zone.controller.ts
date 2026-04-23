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
import { ZoneService } from './zone.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { GetZoneFilterDto } from './dto/zone-filter.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { UpdateZoneStatusDto } from './dto/update-status.dto';

@ApiTags('Zone')
@ApiBearerAuth()
@Controller('zone')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @Role('MASTER_ZONE_CREATE')
  @Post()
  async create(
    @Body() data: CreateZoneDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.zoneService.createZone(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Zone created successfully',
    );
  }

  @Role('MASTER_ZONE_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetZoneFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.zoneService.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Zones fetched successfully',
    );
  }

  @Role('MASTER_ZONE_VIEW')
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.zoneService.findOne(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Zone fetched successfully',
    );
  }

  @Role('MASTER_ZONE_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateZoneDto: UpdateZoneDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.zoneService.updateZone(
      id,
      updateZoneDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Zone updated successfully',
    );
  }

  @Role('MASTER_ZONE_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateZoneStatusDto: UpdateZoneStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateZoneStatusDto.updated_by = req.user.email;
    const result = await this.zoneService.updateZoneStatus(
      id,
      updateZoneStatusDto,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Zone status updated successfully',
    );
  }

  @Role('MASTER_ZONE_DELETE')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.zoneService.remove(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Zone deleted successfully',
    );
  }
}
