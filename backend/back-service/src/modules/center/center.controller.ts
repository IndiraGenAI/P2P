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
import { CenterService } from './center.service';
import { CreateCenterDto } from './dto/create-center.dto';
import { GetCenterFilterDto } from './dto/center-filter.dto';
import { UpdateCenterDto } from './dto/update-center.dto';
import { UpdateCenterStatusDto } from './dto/update-status.dto';

@ApiTags('Center')
@ApiBearerAuth()
@Controller('center')
export class CenterController {
  constructor(private readonly centerService: CenterService) {}

  @Role('MASTER_CENTER_CREATE')
  @Post()
  async create(
    @Body() data: CreateCenterDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.centerService.createCenter(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Center created successfully',
    );
  }

  @Role('MASTER_CENTER_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetCenterFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.centerService.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Centers fetched successfully',
    );
  }

  @Role('MASTER_CENTER_VIEW')
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.centerService.findOne(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Center fetched successfully',
    );
  }

  @Role('MASTER_CENTER_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCenterDto: UpdateCenterDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.centerService.updateCenter(
      id,
      updateCenterDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Center updated successfully',
    );
  }

  @Role('MASTER_CENTER_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCenterStatusDto: UpdateCenterStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateCenterStatusDto.updated_by = req.user.email;
    const result = await this.centerService.updateCenterStatus(
      id,
      updateCenterStatusDto,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Center status updated successfully',
    );
  }

  @Role('MASTER_CENTER_DELETE')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.centerService.remove(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Center deleted successfully',
    );
  }
}
