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
import { baseController } from 'src/core/baseController';
import { ApprovalWorkflowV2Service } from './approval-workflow-v2.service';
import { GetApprovalWorkflowV2ScopeDto } from './dto/get-approval-workflow-v2-scope.dto';
import { SaveApprovalWorkflowV2Dto } from './dto/save-approval-workflow-v2.dto';

@ApiTags('Approval workflow V2')
@ApiBearerAuth()
@Controller('approval-workflow-v2')
export class ApprovalWorkflowV2Controller {
  constructor(private readonly service: ApprovalWorkflowV2Service) {}

  @Role('WORKFLOW_V2_VIEW')
  @Get()
  async findByScope(
    @Query() query: GetApprovalWorkflowV2ScopeDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findByScope(query);
    return baseController.getResult(
      res,
      200,
      result,
      result
        ? 'Approval workflow fetched successfully'
        : 'No approval workflow for this scope',
    );
  }

  @Role('WORKFLOW_V2_VIEW')
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findOneById(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Approval workflow fetched successfully',
    );
  }

  @Role('WORKFLOW_V2_CREATE', 'WORKFLOW_V2_UPDATE')
  @Post()
  async save(
    @Body() body: SaveApprovalWorkflowV2Dto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.save(body, req.user.email);
    return baseController.getResult(
      res,
      200,
      result,
      'Approval workflow saved successfully',
    );
  }
}
