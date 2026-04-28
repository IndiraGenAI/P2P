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
import { CreatePurchaseRequestDto } from './dto/create-purchase-request.dto';
import {
  CreatePurchaseRequestDocumentDto,
  UpdatePurchaseRequestDocumentDto,
} from './dto/purchase-request-document.dto';
import { GetPurchaseRequestFilterDto } from './dto/purchase-request-filter.dto';
import {
  CreatePurchaseRequestItemDto,
  UpdatePurchaseRequestItemDto,
} from './dto/purchase-request-item.dto';
import { UpdatePurchaseRequestDto } from './dto/update-purchase-request.dto';
import { UpdatePurchaseRequestStatusDto } from './dto/update-status.dto';
import { PurchaseRequestService } from './purchase-request.service';

@ApiTags('Purchase Request')
@ApiBearerAuth()
@Controller('purchase-request')
export class PurchaseRequestController {
  constructor(private readonly service: PurchaseRequestService) {}

  // ---------- header CRUD ----------
  @Role('PURCHASE_REQUEST_CREATE')
  @Post()
  async create(
    @Body() data: CreatePurchaseRequestDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.create(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Purchase request created successfully',
    );
  }

  @Role('PURCHASE_REQUEST_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetPurchaseRequestFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAll(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Purchase requests fetched successfully',
    );
  }

  @Role('PURCHASE_REQUEST_VIEW')
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
      'Purchase request fetched successfully',
    );
  }

  @Role('PURCHASE_REQUEST_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePurchaseRequestDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.update(id, updateDto, req.user.email);
    return baseController.getResult(
      res,
      200,
      result,
      'Purchase request updated successfully',
    );
  }

  @Role('PURCHASE_REQUEST_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePurchaseRequestStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateStatus(id, dto, req.user.email);
    return baseController.getResult(
      res,
      200,
      result,
      'Purchase request status updated successfully',
    );
  }

  @Role('PURCHASE_REQUEST_DELETE')
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
      'Purchase request deleted successfully',
    );
  }

  // ---------- item endpoints ----------
  @Role('PURCHASE_REQUEST_UPDATE')
  @Post(':id/items')
  async addItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePurchaseRequestItemDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.addItem(id, dto, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Purchase request item added successfully',
    );
  }

  @Role('PURCHASE_REQUEST_UPDATE')
  @Put(':id/items/:itemId')
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdatePurchaseRequestItemDto,
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
      'Purchase request item updated successfully',
    );
  }

  @Role('PURCHASE_REQUEST_UPDATE')
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
      'Purchase request item deleted successfully',
    );
  }

  // ---------- document endpoints ----------
  @Role('PURCHASE_REQUEST_VIEW')
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

  @Role('PURCHASE_REQUEST_UPDATE')
  @Post(':id/documents')
  async addDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePurchaseRequestDocumentDto,
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

  @Role('PURCHASE_REQUEST_UPDATE')
  @Put(':id/documents/:docId')
  async updateDocument(
    @Param('id', ParseIntPipe) id: number,
    @Param('docId', ParseIntPipe) docId: number,
    @Body() dto: UpdatePurchaseRequestDocumentDto,
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

  @Role('PURCHASE_REQUEST_UPDATE')
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
