import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { dataSource } from '@core/data-source';
import {
  ApprovalWorkflow,
  ApprovalWorkflowStep,
  ApprovalWorkflowStepRole,
  ApprovalWorkflowStepUser,
  ApprovalWorkflowTier,
} from 'erp-db';
import { FindOptionsWhere, IsNull } from 'typeorm';
import { GetApprovalWorkflowScopeDto } from './dto/get-approval-workflow-scope.dto';
import { SaveApprovalWorkflowDto } from './dto/save-approval-workflow.dto';
import { approvalWorkflowRepository } from './repository/approval-workflow.repository';

export interface ApprovalWorkflowResponse {
  id: number;
  scope: {
    entity_id: number;
    transaction_type: string;
    subdepartment_id: number;
    center_id: number | null;
  };
  limits: Array<{
    order: number;
    min: number;
    max: number | null;
    steps: Array<{
      order: number;
      role: 'REVIEWER' | 'APPROVER';
      user_ids: number[];
    }>;
  }>;
}

@Injectable()
export class ApprovalWorkflowService {
  private scopeWhere(
    dto: Pick<
      GetApprovalWorkflowScopeDto,
      'entity_id' | 'transaction_type' | 'subdepartment_id' | 'center_id'
    >,
  ): FindOptionsWhere<ApprovalWorkflow> {
    const centerId = dto.center_id;
    const base: FindOptionsWhere<ApprovalWorkflow> = {
      entity_id: dto.entity_id,
      transaction_type: dto.transaction_type,
      subdepartment_id: dto.subdepartment_id,
    };
    if (centerId === undefined || centerId === null) {
      return { ...base, center_id: IsNull() };
    }
    return { ...base, center_id: centerId };
  }

  private toResponse(w: ApprovalWorkflow): ApprovalWorkflowResponse {
    const tiers = [...(w.tiers ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order,
    );
    return {
      id: w.id,
      scope: {
        entity_id: w.entity_id,
        transaction_type: w.transaction_type,
        subdepartment_id: w.subdepartment_id,
        center_id: w.center_id,
      },
      limits: tiers.map((t) => ({
        order: t.sort_order,
        min: Number(t.min_amount),
        max: t.max_amount === null || t.max_amount === undefined
          ? null
          : Number(t.max_amount),
        steps: [...(t.steps ?? [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((s) => ({
            order: s.sort_order,
            role: s.step_role as 'REVIEWER' | 'APPROVER',
            user_ids: [...(s.step_users ?? [])].map((u) => u.user_id),
          })),
      })),
    };
  }

  async findByScope(
    dto: GetApprovalWorkflowScopeDto,
  ): Promise<ApprovalWorkflowResponse | null> {
    const row = await approvalWorkflowRepository.findOne({
      where: this.scopeWhere(dto),
      relations: {
        tiers: {
          steps: {
            step_users: true,
          },
        },
      },
    });
    return row ? this.toResponse(row) : null;
  }

  async findOneById(id: number): Promise<ApprovalWorkflowResponse> {
    const row = await approvalWorkflowRepository.findOne({
      where: { id },
      relations: {
        tiers: {
          steps: {
            step_users: true,
          },
        },
      },
    });
    if (!row) {
      throw new NotFoundException(`Approval workflow ${id} not found`);
    }
    return this.toResponse(row);
  }

  async save(
    dto: SaveApprovalWorkflowDto,
    userEmail: string | null,
  ): Promise<ApprovalWorkflowResponse> {
    for (const lim of dto.limits) {
      const roles = new Set(lim.steps.map((s) => s.role));
      if (
        !roles.has(ApprovalWorkflowStepRole.REVIEWER) ||
        !roles.has(ApprovalWorkflowStepRole.APPROVER)
      ) {
        throw new BadRequestException(
          'Each limit must include at least one REVIEWER and one APPROVER step',
        );
      }
    }
    const audit = userEmail ?? null;

    return dataSource.transaction(async (manager) => {
      const where = this.scopeWhere(dto);
      const existing = await manager.findOne(ApprovalWorkflow, {
        where,
        select: { id: true },
      });
      if (existing) {
        await manager.delete(ApprovalWorkflow, { id: existing.id });
      }

      const centerId =
        dto.center_id === undefined || dto.center_id === null
          ? null
          : dto.center_id;

      const workflow = manager.create(ApprovalWorkflow, {
        entity_id: dto.entity_id,
        transaction_type: dto.transaction_type,
        subdepartment_id: dto.subdepartment_id,
        center_id: centerId,
        status: true,
        created_by: audit,
        updated_by: audit,
      });

      const saved = await manager.save(ApprovalWorkflow, workflow);

      for (const lim of dto.limits) {
        const tier = manager.create(ApprovalWorkflowTier, {
          workflow: saved,
          sort_order: lim.order,
          min_amount: String(lim.min),
          max_amount:
            lim.max === undefined || lim.max === null
              ? null
              : String(lim.max),
          created_by: audit,
          updated_by: audit,
        });
        const tierSaved = await manager.save(ApprovalWorkflowTier, tier);

        for (const st of lim.steps) {
          const step = manager.create(ApprovalWorkflowStep, {
            tier: tierSaved,
            sort_order: st.order,
            step_role: st.role,
            created_by: audit,
            updated_by: audit,
          });
          const stepSaved = await manager.save(ApprovalWorkflowStep, step);

          for (const uid of st.user_ids) {
            const su = manager.create(ApprovalWorkflowStepUser, {
              step: stepSaved,
              user_id: uid,
            });
            await manager.save(ApprovalWorkflowStepUser, su);
          }
        }
      }

      const full = await manager.findOne(ApprovalWorkflow, {
        where: { id: saved.id },
        relations: {
          tiers: {
            steps: {
              step_users: true,
            },
          },
        },
      });
      if (!full) {
        throw new Error('Failed to load saved approval workflow');
      }
      return this.toResponse(full);
    });
  }
}
