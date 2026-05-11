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
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import {
  CreatePurchaseOrderDocumentDto,
  UpdatePurchaseOrderDocumentDto,
} from './dto/purchase-order-document.dto';
import { GetPurchaseOrderFilterDto } from './dto/purchase-order-filter.dto';
import {
  CreatePurchaseOrderItemDto,
  UpdatePurchaseOrderItemDto,
} from './dto/purchase-order-item.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { PurchaseOrderApprovalDecisionDto } from './dto/purchase-order-approval-decision.dto';
import { UpdatePurchaseOrderStatusDto } from './dto/update-status.dto';
import { PurchaseOrderService } from './purchase-order.service';

@ApiTags('Purchase Order')
@ApiBearerAuth()
@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly service: PurchaseOrderService) {}

  @Role('PROCUREMENT_PURCHASE_ORDER_CREATE')
  @Post()
  async create(
    @Body() data: CreatePurchaseOrderDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.create(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Purchase order created successfully',
    );
  }

  @Role('PROCUREMENT_PURCHASE_ORDER_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetPurchaseOrderFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAll(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Purchase orders fetched successfully',
    );
  }

  @Role('PROCUREMENT_PURCHASE_ORDER_VIEW')
  @Get('status-counts')
  async getStatusCounts(@Res() res: Response): Promise<Response> {
    const result = await this.service.getStatusCounts();
    return baseController.getResult(
      res,
      200,
      result,
      'Purchase order status counts fetched successfully',
    );
  }

  @Role('PROCUREMENT_PURCHASE_ORDER_VIEW')
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

  @Role('PROCUREMENT_PURCHASE_ORDER_VIEW')
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
      'Purchase order fetched successfully',
    );
  }

  @Role('PROCUREMENT_PURCHASE_ORDER_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePurchaseOrderDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.update(id, updateDto, req.user.email);
    return baseController.getResult(
      res,
      200,
      result,
      'Purchase order updated successfully',
    );
  }

  @Role('PROCUREMENT_PURCHASE_ORDER_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePurchaseOrderStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateStatus(id, dto, req.user.email);
    return baseController.getResult(
      res,
      200,
      result,
      'Purchase order status updated successfully',
    );
  }

  @Role('PROCUREMENT_PURCHASE_ORDER_UPDATE')
  @Post(':id/approval-decision')
  async approvalDecision(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PurchaseOrderApprovalDecisionDto,
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

  @Role('PROCUREMENT_PURCHASE_ORDER_DELETE')
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
      'Purchase order deleted successfully',
    );
  }

  @Role('PROCUREMENT_PURCHASE_ORDER_UPDATE')
  @Post(':id/items')
  async addItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePurchaseOrderItemDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.addItem(id, dto, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Purchase order item added successfully',
    );
  }

  @Role('PROCUREMENT_PURCHASE_ORDER_UPDATE')
  @Put(':id/items/:itemId')
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdatePurchaseOrderItemDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateItem(
      id,
      itemId,
      dto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Purchase order item updated successfully',
    );
  }

  @Role('PROCUREMENT_PURCHASE_ORDER_UPDATE')
  @Delete(':id/items/:itemId')
  async removeItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.removeItem(id, itemId);
    return baseController.getResult(
      res,
      200,
      result,
      'Purchase order item deleted successfully',
    );
  }

  @Role('PROCUREMENT_PURCHASE_ORDER_VIEW')
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

  @Role('PROCUREMENT_PURCHASE_ORDER_UPDATE')
  @Post(':id/documents')
  async addDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePurchaseOrderDocumentDto,
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

  @Role('PROCUREMENT_PURCHASE_ORDER_UPDATE')
  @Put(':id/documents/:docId')
  async updateDocument(
    @Param('id', ParseIntPipe) id: number,
    @Param('docId', ParseIntPipe) docId: number,
    @Body() dto: UpdatePurchaseOrderDocumentDto,
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

  @Role('PROCUREMENT_PURCHASE_ORDER_UPDATE')
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
