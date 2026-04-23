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
import { InvoiceSourceService } from './invoice-source.service';
import { CreateInvoiceSourceDto } from './dto/create-invoice-source.dto';
import { GetInvoiceSourceFilterDto } from './dto/invoice-source-filter.dto';
import { UpdateInvoiceSourceDto } from './dto/update-invoice-source.dto';
import { UpdateInvoiceSourceStatusDto } from './dto/update-status.dto';

@ApiTags('Invoice Source')
@ApiBearerAuth()
@Controller('invoice-source')
export class InvoiceSourceController {
  constructor(private readonly service: InvoiceSourceService) {}

  @Role('MASTER_INVOICE_SOURCE_CREATE')
  @Post()
  async create(
    @Body() data: CreateInvoiceSourceDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.createInvoiceSource(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Invoice source created successfully',
    );
  }

  @Role('MASTER_INVOICE_SOURCE_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetInvoiceSourceFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Invoice sources fetched successfully',
    );
  }

  @Role('MASTER_INVOICE_SOURCE_VIEW')
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
      'Invoice source fetched successfully',
    );
  }

  @Role('MASTER_INVOICE_SOURCE_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateInvoiceSourceDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateInvoiceSource(
      id,
      updateDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Invoice source updated successfully',
    );
  }

  @Role('MASTER_INVOICE_SOURCE_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateInvoiceSourceStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateStatus(id, updateStatusDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Invoice source status updated successfully',
    );
  }

  @Role('MASTER_INVOICE_SOURCE_DELETE')
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
      'Invoice source deleted successfully',
    );
  }
}
