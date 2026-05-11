import { Role } from '@core/guards/role.guard';
import type { AuthenticatedRequest } from '@core/guards/role.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { baseController } from '@core/baseController';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { GetBudgetFilterDto } from './dto/get-budget-filter.dto';
import { BudgetService } from './budget.service';

@ApiTags('Budget')
@ApiBearerAuth()
@Controller('budget')
export class BudgetController {
  constructor(private readonly service: BudgetService) {}

  @Role('FINANCE_BUDGETS_CREATE')
  @Post()
  async create(
    @Body() data: CreateBudgetDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.create(data, req.user.email);
    return baseController.getResult(res, 201, result, 'Budget created successfully');
  }

  @Role('FINANCE_BUDGETS_VIEW')
  @Get()
  async findAll(
    @Query() filter: GetBudgetFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAll(filter);
    return baseController.getResult(res, 200, result, 'Budgets fetched successfully');
  }

  @Role('FINANCE_BUDGETS_VIEW')
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findOne(id);
    return baseController.getResult(res, 200, result, 'Budget fetched successfully');
  }
}
