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
import { StateService } from './state.service';
import { CreateStateDto } from './dto/create-state.dto';
import { GetStateFilterDto } from './dto/state-filter.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { UpdateStateStatusDto } from './dto/update-status.dto';

@ApiTags('State')
@ApiBearerAuth()
@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Role('MASTER_STATE_CREATE')
  @Post()
  async create(
    @Body() data: CreateStateDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.stateService.createState(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'State created successfully',
    );
  }

  @Role('MASTER_STATE_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetStateFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.stateService.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'States fetched successfully',
    );
  }

  @Role('MASTER_STATE_VIEW')
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.stateService.findOne(id);
    return baseController.getResult(
      res,
      200,
      result,
      'State fetched successfully',
    );
  }

  @Role('MASTER_STATE_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStateDto: UpdateStateDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.stateService.updateState(
      id,
      updateStateDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'State updated successfully',
    );
  }

  @Role('MASTER_STATE_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStateStatusDto: UpdateStateStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStateStatusDto.updated_by = req.user.email;
    const result = await this.stateService.updateStateStatus(
      id,
      updateStateStatusDto,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'State status updated successfully',
    );
  }

  @Role('MASTER_STATE_DELETE')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.stateService.remove(id);
    return baseController.getResult(
      res,
      200,
      result,
      'State deleted successfully',
    );
  }
}
