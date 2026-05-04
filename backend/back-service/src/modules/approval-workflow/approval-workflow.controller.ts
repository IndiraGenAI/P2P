import { Role } from '@core/guards/role.guard';
import type { AuthenticatedRequest } from '@core/guards/role.guard';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { baseController } from 'src/core/baseController';
import { ApprovalWorkflowService } from './approval-workflow.service';
import { GetApprovalWorkflowScopeDto } from './dto/get-approval-workflow-scope.dto';
import { SaveApprovalWorkflowDto } from './dto/save-approval-workflow.dto';

@ApiTags('Approval workflow')
@ApiBearerAuth()
@Controller('approval-workflow')
export class ApprovalWorkflowController {
  constructor(private readonly approvalWorkflowService: ApprovalWorkflowService) {}

  /** DB tags: `page_code` + `_` + `action_code` (see `data.sql` page_actions). */
  @Role('WORKFLOW_V1_VIEW')
  @Get()
  async findByScope(
    @Query() query: GetApprovalWorkflowScopeDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.approvalWorkflowService.findByScope(query);
    return baseController.getResult(
      res,
      200,
      result,
      result
        ? 'Approval workflow fetched successfully'
        : 'No approval workflow for this scope',
    );
  }

  @Role('WORKFLOW_V1_VIEW')
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.approvalWorkflowService.findOneById(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Approval workflow fetched successfully',
    );
  }

  @Role('WORKFLOW_V1_CREATE', 'WORKFLOW_V1_UPDATE')
  @Post()
  async save(
    @Body() body: SaveApprovalWorkflowDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.approvalWorkflowService.save(body, req.user.email);
    return baseController.getResult(
      res,
      200,
      result,
      'Approval workflow saved successfully',
    );
  }
}
