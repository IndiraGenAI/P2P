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
import { CreateGrnDto } from './dto/create-grn.dto';
import {
  CreateGrnDocumentDto,
  UpdateGrnDocumentDto,
} from './dto/grn-document.dto';
import { GetGrnFilterDto } from './dto/get-grn-filter.dto';
import { GrnApprovalDecisionDto } from './dto/grn-approval-decision.dto';
import { UpdateGrnDto } from './dto/update-grn.dto';
import { UpdateGrnStatusDto } from './dto/update-grn-status.dto';
import { GrnService } from './grn.service';

@ApiTags('GRN')
@ApiBearerAuth()
@Controller('grn')
export class GrnController {
  constructor(private readonly service: GrnService) {}

  @Role('PROCUREMENT_GRN_CREATE')
  @Post()
  async create(
    @Body() data: CreateGrnDto,
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

  @Role('PROCUREMENT_GRN_UPDATE')
  @Post(':id/approval-decision')
  async approvalDecision(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: GrnApprovalDecisionDto,
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

  @Role('PROCUREMENT_GRN_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetGrnFilterDto,
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

  @Role('PROCUREMENT_GRN_VIEW')
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

  @Role('PROCUREMENT_GRN_VIEW')
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

  @Role('PROCUREMENT_GRN_VIEW')
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

  @Role('PROCUREMENT_GRN_VIEW')
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

  @Role('PROCUREMENT_GRN_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateGrnDto,
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

  @Role('PROCUREMENT_GRN_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGrnStatusDto,
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

  @Role('PROCUREMENT_GRN_DELETE')
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

  @Role('PROCUREMENT_GRN_UPDATE')
  @Post(':id/documents')
  async addDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateGrnDocumentDto,
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

  @Role('PROCUREMENT_GRN_UPDATE')
  @Put(':id/documents/:docId')
  async updateDocument(
    @Param('id', ParseIntPipe) id: number,
    @Param('docId', ParseIntPipe) docId: number,
    @Body() dto: UpdateGrnDocumentDto,
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

  @Role('PROCUREMENT_GRN_UPDATE')
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
