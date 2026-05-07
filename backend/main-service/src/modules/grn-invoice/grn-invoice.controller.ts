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
import { baseController } from '@core/baseController';
import { CreateGrnInvoiceDto } from './dto/create-grn-invoice.dto';
import {
  CreateGrnInvoiceDocumentDto,
  UpdateGrnInvoiceDocumentDto,
} from './dto/grn-invoice-document.dto';
import { GetGrnInvoiceFilterDto } from './dto/get-grn-invoice-filter.dto';
import { GrnInvoiceApprovalDecisionDto } from './dto/grn-invoice-approval-decision.dto';
import { UpdateGrnInvoiceDto } from './dto/update-grn-invoice.dto';
import { UpdateGrnInvoiceStatusDto } from './dto/update-grn-invoice-status.dto';
import { GrnInvoiceService } from './grn-invoice.service';

@ApiTags('GRN Invoice')
@ApiBearerAuth()
@Controller('grn-invoice')
export class GrnInvoiceController {
  constructor(private readonly service: GrnInvoiceService) {}

  @Role('PROCUREMENT_GRN_INVOICE_CREATE')
  @Post()
  async create(
    @Body() data: CreateGrnInvoiceDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.create(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'GRN created successfully',
    );
  }

  @Role('PROCUREMENT_GRN_INVOICE_UPDATE')
  @Post(':id/approval-decision')
  async approvalDecision(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: GrnInvoiceApprovalDecisionDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.recordApprovalDecision(
      id,
      req.user.id,
      req.user.email,
      dto,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Approval decision recorded successfully',
    );
  }

  @Role('PROCUREMENT_GRN_INVOICE_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetGrnInvoiceFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAll(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'GRNs fetched successfully',
    );
  }

  @Role('PROCUREMENT_GRN_INVOICE_VIEW')
  @Get('status-counts')
  async getStatusCounts(@Res() res: Response): Promise<Response> {
    const result = await this.service.getStatusCounts();
    return baseController.getResult(
      res,
      200,
      result,
      'Status counts fetched successfully',
    );
  }

  @Role('PROCUREMENT_GRN_INVOICE_VIEW')
  @Get(':id/approval-trail')
  async findOneApprovalTrail(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findOneApprovalTrail(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Approval trail fetched successfully',
    );
  }

  @Role('PROCUREMENT_GRN_INVOICE_VIEW')
  @Get(':id/documents')
  async listDocuments(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.listDocuments(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Documents fetched successfully',
    );
  }

  @Role('PROCUREMENT_GRN_INVOICE_VIEW')
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
      'GRN fetched successfully',
    );
  }

  @Role('PROCUREMENT_GRN_INVOICE_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateGrnInvoiceDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.update(id, updateDto, req.user.email);
    return baseController.getResult(
      res,
      200,
      result,
      'GRN updated successfully',
    );
  }

  @Role('PROCUREMENT_GRN_INVOICE_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGrnInvoiceStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateStatus(id, dto, req.user.email);
    return baseController.getResult(
      res,
      200,
      result,
      'GRN status updated successfully',
    );
  }

  @Role('PROCUREMENT_GRN_INVOICE_DELETE')
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
      'GRN deleted successfully',
    );
  }

  @Role('PROCUREMENT_GRN_INVOICE_UPDATE')
  @Post(':id/documents')
  async addDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateGrnInvoiceDocumentDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.addDocument(id, dto, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Document added successfully',
    );
  }

  @Role('PROCUREMENT_GRN_INVOICE_UPDATE')
  @Put(':id/documents/:docId')
  async updateDocument(
    @Param('id', ParseIntPipe) id: number,
    @Param('docId', ParseIntPipe) docId: number,
    @Body() dto: UpdateGrnInvoiceDocumentDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.updateDocument(id, docId, dto);
    return baseController.getResult(
      res,
      200,
      result,
      'Document updated successfully',
    );
  }

  @Role('PROCUREMENT_GRN_INVOICE_UPDATE')
  @Delete(':id/documents/:docId')
  async removeDocument(
    @Param('id', ParseIntPipe) id: number,
    @Param('docId', ParseIntPipe) docId: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.removeDocument(id, docId);
    return baseController.getResult(
      res,
      200,
      result,
      'Document deleted successfully',
    );
  }
}
