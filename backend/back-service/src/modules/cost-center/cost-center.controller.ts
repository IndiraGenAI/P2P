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
import { CostCenterService } from './cost-center.service';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { GetCostCenterFilterDto } from './dto/cost-center-filter.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';
import { UpdateCostCenterStatusDto } from './dto/update-status.dto';

@ApiTags('Cost Center')
@ApiBearerAuth()
@Controller('cost-center')
export class CostCenterController {
  constructor(private readonly costCenterService: CostCenterService) {}

  @Role('MASTER_COST_CENTER_CREATE')
  @Post()
  async create(
    @Body() data: CreateCostCenterDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.costCenterService.createCostCenter(
      data,
      req.user.email,
    );
    return baseController.getResult(
      res,
      201,
      result,
      'Cost center created successfully',
    );
  }

  @Role('MASTER_COST_CENTER_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetCostCenterFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.costCenterService.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Cost centers fetched successfully',
    );
  }

  @Role('MASTER_COST_CENTER_VIEW')
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.costCenterService.findOne(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Cost center fetched successfully',
    );
  }

  @Role('MASTER_COST_CENTER_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCostCenterDto: UpdateCostCenterDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.costCenterService.updateCostCenter(
      id,
      updateCostCenterDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Cost center updated successfully',
    );
  }

  @Role('MASTER_COST_CENTER_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCostCenterStatusDto: UpdateCostCenterStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateCostCenterStatusDto.updated_by = req.user.email;
    const result = await this.costCenterService.updateCostCenterStatus(
      id,
      updateCostCenterStatusDto,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Cost center status updated successfully',
    );
  }

  @Role('MASTER_COST_CENTER_DELETE')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.costCenterService.remove(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Cost center deleted successfully',
    );
  }
}
