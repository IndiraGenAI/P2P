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
import { EntityService } from './entity.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { GetEntityFilterDto } from './dto/entity-filter.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { UpdateEntityStatusDto } from './dto/update-status.dto';

@ApiTags('Entity')
@ApiBearerAuth()
@Controller('entity')
export class EntityController {
  constructor(private readonly service: EntityService) {}

  @Role('MASTER_ENTITY_CREATE')
  @Post()
  async create(
    @Body() data: CreateEntityDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.createEntity(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Entity created successfully',
    );
  }

  @Role('MASTER_ENTITY_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetEntityFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Entity records fetched successfully',
    );
  }

  @Role('MASTER_ENTITY_VIEW')
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
      'Entity fetched successfully',
    );
  }

  @Role('MASTER_ENTITY_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEntityDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateEntity(
      id,
      updateDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Entity updated successfully',
    );
  }

  @Role('MASTER_ENTITY_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateEntityStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateStatus(id, updateStatusDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Entity status updated successfully',
    );
  }

  @Role('MASTER_ENTITY_DELETE')
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
      'Entity deleted successfully',
    );
  }
}
