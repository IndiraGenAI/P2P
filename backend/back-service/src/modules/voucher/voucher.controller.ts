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
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { GetVoucherFilterDto } from './dto/voucher-filter.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { UpdateVoucherStatusDto } from './dto/update-status.dto';

@ApiTags('Voucher')
@ApiBearerAuth()
@Controller('voucher')
export class VoucherController {
  constructor(private readonly service: VoucherService) {}

  @Role('MASTER_VOUCHER_CREATE')
  @Post()
  async create(
    @Body() data: CreateVoucherDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.createVoucher(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Voucher created successfully',
    );
  }

  @Role('MASTER_VOUCHER_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetVoucherFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Vouchers fetched successfully',
    );
  }

  @Role('MASTER_VOUCHER_VIEW')
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
      'Voucher fetched successfully',
    );
  }

  @Role('MASTER_VOUCHER_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateVoucherDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateVoucher(
      id,
      updateDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Voucher updated successfully',
    );
  }

  @Role('MASTER_VOUCHER_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateVoucherStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateStatus(id, updateStatusDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Voucher status updated successfully',
    );
  }

  @Role('MASTER_VOUCHER_DELETE')
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
      'Voucher deleted successfully',
    );
  }
}
