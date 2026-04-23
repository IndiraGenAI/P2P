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
import { GstService } from './gst.service';
import { CreateGstDto } from './dto/create-gst.dto';
import { GetGstFilterDto } from './dto/gst-filter.dto';
import { UpdateGstDto } from './dto/update-gst.dto';
import { UpdateGstStatusDto } from './dto/update-status.dto';

@ApiTags('GST')
@ApiBearerAuth()
@Controller('gst')
export class GstController {
  constructor(private readonly service: GstService) {}

  @Role('MASTER_GST_CREATE')
  @Post()
  async create(
    @Body() data: CreateGstDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.createGst(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'GST created successfully',
    );
  }

  @Role('MASTER_GST_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetGstFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'GST records fetched successfully',
    );
  }

  @Role('MASTER_GST_VIEW')
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
      'GST fetched successfully',
    );
  }

  @Role('MASTER_GST_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateGstDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateGst(
      id,
      updateDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'GST updated successfully',
    );
  }

  @Role('MASTER_GST_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateGstStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateStatus(id, updateStatusDto);
    return baseController.getResult(
      res,
      200,
      result,
      'GST status updated successfully',
    );
  }

  @Role('MASTER_GST_DELETE')
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
      'GST deleted successfully',
    );
  }
}
