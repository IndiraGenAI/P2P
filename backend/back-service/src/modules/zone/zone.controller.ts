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

  @SkipAuth()
  @Post()
  async create(
    @Body() data: CreateZoneDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const userEmailId = (req.headers.emailId as string) || null;
    const result = await this.zoneService.createZone(data, userEmailId);
    return baseController.getResult(
      res,
      201,
      result,
      'Zone created successfully',
    );
  }

  @SkipAuth()
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

  @SkipAuth()
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

  @SkipAuth()
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateZoneDto: UpdateZoneDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const userEmailId = (req.headers.emailId as string) || null;
    const result = await this.zoneService.updateZone(
      id,
      updateZoneDto,
      userEmailId,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Zone updated successfully',
    );
  }

  @SkipAuth()
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateZoneStatusDto: UpdateZoneStatusDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    if (req.headers.emailId) {
      updateZoneStatusDto.updated_by = req.headers.emailId as string;
    }
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

  @SkipAuth()
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
