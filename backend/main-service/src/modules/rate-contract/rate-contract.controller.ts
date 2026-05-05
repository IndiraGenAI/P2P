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
import { CreateRateContractDto } from './dto/create-rate-contract.dto';
import {
  CreateRateContractDocumentDto,
  UpdateRateContractDocumentDto,
} from './dto/rate-contract-document.dto';
import { GetRateContractFilterDto } from './dto/get-rate-contract-filter.dto';
import { RateContractApprovalDecisionDto } from './dto/rate-contract-approval-decision.dto';
import { UpdateRateContractDto } from './dto/update-rate-contract.dto';
import { UpdateRateContractStatusDto } from './dto/update-rate-contract-status.dto';
import { RateContractService } from './rate-contract.service';

@ApiTags('Rate Contract')
@ApiBearerAuth()
@Controller('rate-contract')
export class RateContractController {
  constructor(private readonly service: RateContractService) {}

  @Role('PROCUREMENT_RATE_CONTRACT_CREATE')
  @Post()
  async create(
    @Body() data: CreateRateContractDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.create(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Rate contract created successfully',
    );
  }

  @Role('PROCUREMENT_RATE_CONTRACT_UPDATE')
  @Post(':id/approval-decision')
  async approvalDecision(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RateContractApprovalDecisionDto,
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

  @Role('PROCUREMENT_RATE_CONTRACT_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetRateContractFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAll(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Rate contracts fetched successfully',
    );
  }

  @Role('PROCUREMENT_RATE_CONTRACT_VIEW')
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

  @Role('PROCUREMENT_RATE_CONTRACT_VIEW')
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

  @Role('PROCUREMENT_RATE_CONTRACT_VIEW')
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

  @Role('PROCUREMENT_RATE_CONTRACT_VIEW')
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
      'Rate contract fetched successfully',
    );
  }

  @Role('PROCUREMENT_RATE_CONTRACT_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRateContractDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.update(id, updateDto, req.user.email);
    return baseController.getResult(
      res,
      200,
      result,
      'Rate contract updated successfully',
    );
  }

  @Role('PROCUREMENT_RATE_CONTRACT_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRateContractStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateStatus(id, dto, req.user.email);
    return baseController.getResult(
      res,
      200,
      result,
      'Rate contract status updated successfully',
    );
  }

  @Role('PROCUREMENT_RATE_CONTRACT_DELETE')
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
      'Rate contract deleted successfully',
    );
  }

  @Role('PROCUREMENT_RATE_CONTRACT_UPDATE')
  @Post(':id/documents')
  async addDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateRateContractDocumentDto,
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

  @Role('PROCUREMENT_RATE_CONTRACT_UPDATE')
  @Put(':id/documents/:docId')
  async updateDocument(
    @Param('id', ParseIntPipe) id: number,
    @Param('docId', ParseIntPipe) docId: number,
    @Body() dto: UpdateRateContractDocumentDto,
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

  @Role('PROCUREMENT_RATE_CONTRACT_UPDATE')
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
