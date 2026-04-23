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
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { GetCurrencyFilterDto } from './dto/currency-filter.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { UpdateCurrencyStatusDto } from './dto/update-status.dto';

@ApiTags('Currency')
@ApiBearerAuth()
@Controller('currency')
export class CurrencyController {
  constructor(private readonly service: CurrencyService) {}

  @Role('MASTER_CURRENCY_CREATE')
  @Post()
  async create(
    @Body() data: CreateCurrencyDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.createCurrency(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Currency created successfully',
    );
  }

  @Role('MASTER_CURRENCY_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetCurrencyFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Currencies fetched successfully',
    );
  }

  @Role('MASTER_CURRENCY_VIEW')
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
      'Currency fetched successfully',
    );
  }

  @Role('MASTER_CURRENCY_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCurrencyDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateCurrency(
      id,
      updateDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Currency updated successfully',
    );
  }

  @Role('MASTER_CURRENCY_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateCurrencyStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateStatus(id, updateStatusDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Currency status updated successfully',
    );
  }

  @Role('MASTER_CURRENCY_DELETE')
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
      'Currency deleted successfully',
    );
  }
}
