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

  @SkipAuth()
  @Post()
  async create(
    @Body() data: CreateStateDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const userEmailId = (req.headers.emailId as string) || null;
    const result = await this.stateService.createState(data, userEmailId);
    return baseController.getResult(
      res,
      201,
      result,
      'State created successfully',
    );
  }

  @SkipAuth()
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

  @SkipAuth()
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

  @SkipAuth()
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStateDto: UpdateStateDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const userEmailId = (req.headers.emailId as string) || null;
    const result = await this.stateService.updateState(
      id,
      updateStateDto,
      userEmailId,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'State updated successfully',
    );
  }

  @SkipAuth()
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStateStatusDto: UpdateStateStatusDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    if (req.headers.emailId) {
      updateStateStatusDto.updated_by = req.headers.emailId as string;
    }
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

  @SkipAuth()
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
