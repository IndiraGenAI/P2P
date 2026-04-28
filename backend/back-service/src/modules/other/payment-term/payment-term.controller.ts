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
import { PaymentTermService } from './payment-term.service';
import { CreatePaymentTermDto } from './dto/create-payment-term.dto';
import { GetPaymentTermFilterDto } from './dto/payment-term-filter.dto';
import { UpdatePaymentTermDto } from './dto/update-payment-term.dto';
import { UpdatePaymentTermStatusDto } from './dto/update-status.dto';

@ApiTags('Payment Term')
@ApiBearerAuth()
@Controller('payment-term')
export class PaymentTermController {
  constructor(private readonly service: PaymentTermService) {}

  @Role('MASTER_PAYMENT_TERMS_CREATE')
  @Post()
  async create(
    @Body() data: CreatePaymentTermDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.create(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Payment term created successfully',
    );
  }

  @Role('MASTER_PAYMENT_TERMS_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetPaymentTermFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAll(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Payment terms fetched successfully',
    );
  }

  @Role('MASTER_PAYMENT_TERMS_VIEW')
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
      'Payment term fetched successfully',
    );
  }

  @Role('MASTER_PAYMENT_TERMS_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePaymentTermDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.update(
      id,
      updateDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Payment term updated successfully',
    );
  }

  @Role('MASTER_PAYMENT_TERMS_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdatePaymentTermStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateStatus(id, updateStatusDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Payment term status updated successfully',
    );
  }

  @Role('MASTER_PAYMENT_TERMS_DELETE')
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
      'Payment term deleted successfully',
    );
  }
}
