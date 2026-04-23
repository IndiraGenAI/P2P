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
import { CoaService } from './coa.service';
import { CreateCoaDto } from './dto/create-coa.dto';
import { GetCoaFilterDto } from './dto/coa-filter.dto';
import { UpdateCoaDto } from './dto/update-coa.dto';
import { UpdateCoaStatusDto } from './dto/update-status.dto';

@ApiTags('COA')
@ApiBearerAuth()
@Controller('coa')
export class CoaController {
  constructor(private readonly service: CoaService) {}

  @Role('MASTER_COA_CREATE')
  @Post()
  async create(
    @Body() data: CreateCoaDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.createCoa(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'COA created successfully',
    );
  }

  @Role('MASTER_COA_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetCoaFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'COA records fetched successfully',
    );
  }

  @Role('MASTER_COA_VIEW')
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
      'COA fetched successfully',
    );
  }

  @Role('MASTER_COA_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCoaDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateCoa(
      id,
      updateDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'COA updated successfully',
    );
  }

  @Role('MASTER_COA_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateCoaStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateStatus(id, updateStatusDto);
    return baseController.getResult(
      res,
      200,
      result,
      'COA status updated successfully',
    );
  }

  @Role('MASTER_COA_DELETE')
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
      'COA deleted successfully',
    );
  }
}
