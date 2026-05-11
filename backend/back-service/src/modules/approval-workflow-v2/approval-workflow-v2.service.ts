import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { dataSource } from '@core/data-source';
import {
  ApprovalWorkflowStepRole,
  ApprovalWorkflowV2,
  ApprovalWorkflowV2Scope,
  ApprovalWorkflowV2Step,
  ApprovalWorkflowV2StepUser,
} from 'erp-db';
import { GetApprovalWorkflowV2ScopeDto } from './dto/get-approval-workflow-v2-scope.dto';
import { SaveApprovalWorkflowV2Dto } from './dto/save-approval-workflow-v2.dto';
import { approvalWorkflowV2Repository } from './repository/approval-workflow-v2.repository';

export interface ApprovalWorkflowV2Response {
  id: number;
  scope: ApprovalWorkflowV2Scope;
  steps: Array<{
    order: number;
    role: 'REVIEWER' | 'APPROVER';
    user_ids: number[];
  }>;
}

@Injectable()
export class ApprovalWorkflowV2Service {
  private toResponse(w: ApprovalWorkflowV2): ApprovalWorkflowV2Response {
    const steps = [...(w.steps ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order,
    );
    return {
      id: w.id,
      scope: w.scope as ApprovalWorkflowV2Scope,
      steps: steps.map((s) => ({
        order: s.sort_order,
        role: s.step_role as 'REVIEWER' | 'APPROVER',
        user_ids: [...(s.step_users ?? [])].map((u) => u.user_id),
      })),
    };
  }

  async findByScope(
    dto: GetApprovalWorkflowV2ScopeDto,
  ): Promise<ApprovalWorkflowV2Response | null> {
    const row = await approvalWorkflowV2Repository.findOne({
      where: { scope: dto.scope },
      relations: {
        steps: {
          step_users: true,
        },
      },
    });
    return row ? this.toResponse(row) : null;
  }

  async findOneById(id: number): Promise<ApprovalWorkflowV2Response> {
    const row = await approvalWorkflowV2Repository.findOne({
      where: { id },
      relations: {
        steps: {
          step_users: true,
        },
      },
    });
    if (!row) {
      throw new NotFoundException(`Approval workflow v2 ${id} not found`);
    }
    return this.toResponse(row);
  }

  /**
   * Upsert by scope. Deletes the existing chain (cascades steps + users)
   * and recreates it with the new sequence — same approach as V1.
   */
  async save(
    dto: SaveApprovalWorkflowV2Dto,
    userEmail: string | null,
  ): Promise<ApprovalWorkflowV2Response> {
    const roles = new Set(dto.steps.map((s) => s.role));
    if (
      !roles.has(ApprovalWorkflowStepRole.REVIEWER) ||
      !roles.has(ApprovalWorkflowStepRole.APPROVER)
    ) {
      throw new BadRequestException(
        'Workflow must include at least one REVIEWER and one APPROVER step.',
      );
    }
    const audit = userEmail ?? null;

    return dataSource.transaction(async (manager) => {
      const existing = await manager.findOne(ApprovalWorkflowV2, {
        where: { scope: dto.scope },
        select: { id: true },
      });
      if (existing) {
        await manager.delete(ApprovalWorkflowV2, { id: existing.id });
      }

      const workflow = manager.create(ApprovalWorkflowV2, {
        scope: dto.scope,
        status: true,
        created_by: audit,
        updated_by: audit,
      });
      const saved = await manager.save(ApprovalWorkflowV2, workflow);

      for (const st of dto.steps) {
        const step = manager.create(ApprovalWorkflowV2Step, {
          workflow: saved,
          sort_order: st.order,
          step_role: st.role,
          created_by: audit,
          updated_by: audit,
        });
        const stepSaved = await manager.save(ApprovalWorkflowV2Step, step);

        for (const uid of st.user_ids) {
          const su = manager.create(ApprovalWorkflowV2StepUser, {
            step: stepSaved,
            user_id: uid,
          });
          await manager.save(ApprovalWorkflowV2StepUser, su);
        }
      }

      const full = await manager.findOne(ApprovalWorkflowV2, {
        where: { id: saved.id },
        relations: {
          steps: {
            step_users: true,
          },
        },
      });
      if (!full) {
        throw new Error('Failed to load saved approval workflow v2');
      }
      return this.toResponse(full);
    });
  }
}
