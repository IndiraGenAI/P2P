import { dataSource } from '@core/data-source';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ApprovalWorkflow,
  ApprovalWorkflowStep,
  ApprovalWorkflowStepRole,
  ApprovalWorkflowTier,
  ApprovalWorkflowTransactionType,
  PurchaseRequest,
  PurchaseRequestApprovalAssignee,
  PurchaseRequestApprovalStep,
  PurchaseRequestDocument,
  PurchaseRequestItem,
  Users,
} from 'erp-db';
import { DeleteResult, EntityManager, In, IsNull } from 'typeorm';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { PURCHASE_REQUEST_CONSTANTS } from 'src/commons/constant';
import {
  PrStatus,
  PurchaseRequestApprovalDecision,
  PurchaseRequestApprovalStepStatus,
} from 'src/commons/enum';
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
import { PurchaseRequestApprovalDecisionDto } from './dto/purchase-request-approval-decision.dto';
import { UpdatePurchaseRequestStatusDto } from './dto/update-status.dto';
import {
  PurchaseRequestApprovalActorView,
  PurchaseRequestApprovalListProgress,
  PurchaseRequestApprovalListStep,
  PurchaseRequestApprovalStepView,
  PurchaseRequestApprovalTrailDto,
  PurchaseRequestListResponse,
} from './dto/purchase-request-approval-view.dto';
import { purchaseRequestRepository } from './repository/purchase-request.repository';
import { purchaseRequestDocumentRepository } from './repository/purchase-request-document.repository';
import { purchaseRequestItemRepository } from './repository/purchase-request-item.repository';

@Injectable()
export class PurchaseRequestService {
  private async assertPurchaseRequestExists(
    purchaseRequestId: number,
  ): Promise<PurchaseRequest> {
    const existingPurchaseRequest = await purchaseRequestRepository.findOne({
      where: { id: purchaseRequestId },
    });
    if (!existingPurchaseRequest) {
      throw new NotFoundException(
        `Purchase request id=${purchaseRequestId} not found`,
      );
    }
    return existingPurchaseRequest;
  }

  private async generatePurchaseRequestNumber(
    manager?: EntityManager,
  ): Promise<string> {
    const repository = manager
      ? manager.getRepository(PurchaseRequest)
      : purchaseRequestRepository;

    const lastRecord = await repository
      .createQueryBuilder('purchaseRequest')
      .select('purchaseRequest.pr_number', 'pr_number')
      .where("purchaseRequest.pr_number ~ '^PR-[0-9]+$'")
      .orderBy(
        'CAST(SUBSTRING(purchaseRequest.pr_number FROM 4) AS INTEGER)',
        'DESC',
      )
      .limit(1)
      .getRawOne<{ pr_number: string }>();

    let nextNumber = 1;
    if (lastRecord?.pr_number) {
      const numberPart = parseInt(lastRecord.pr_number.replace(/\D/g, ''), 10);
      if (!Number.isNaN(numberPart)) nextNumber = numberPart + 1;
    }
    return `${PURCHASE_REQUEST_CONSTANTS.NUMBER_PREFIX}${String(nextNumber).padStart(
      PURCHASE_REQUEST_CONSTANTS.NUMBER_PAD,
      '0',
    )}`;
  }

  private toMoney(value: number | undefined | null): string {
    return Number(value ?? 0).toFixed(2);
  }

  private computeItemAmount(item: {
    quantity?: number | null;
    estimated_rate?: number | null;
    amount?: number | null;
  }): number {
    if (item.amount !== undefined && item.amount !== null) {
      return Number(item.amount);
    }
    const quantity = Number(item.quantity ?? 0);
    const estimatedRate = Number(item.estimated_rate ?? 0);
    return quantity * estimatedRate;
  }

  private sumItemsAmount(
    items: { amount?: number | string | null }[],
  ): number {
    return items.reduce(
      (totalAmount, item) => totalAmount + Number(item.amount ?? 0),
      0,
    );
  }

  private assertValidPrLineItem(
    label: string,
    item_id: number | string | null | undefined,
    quantity: unknown,
    estimated_rate: unknown,
  ): void {
    const id = item_id != null ? Number(item_id) : NaN;
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestException(`${label}: Item is required.`);
    }
    const qty = Number(quantity);
    const rate = Number(estimated_rate);
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new BadRequestException(
        `${label}: Quantity must be greater than 0.`,
      );
    }
    if (!Number.isFinite(rate) || rate <= 0) {
      throw new BadRequestException(`${label}: Rate must be greater than 0.`);
    }
  }

  private normalizePrStatus(status: string | null | undefined): string {
    return String(status ?? '').toUpperCase();
  }

  private submissionStatusRequiresWorkflow(
    status: string | null | undefined,
  ): boolean {
    return this.normalizePrStatus(status) === PrStatus.SUBMITTED;
  }

  private async assertDirectApproveRejectNotUsed(
    purchaseRequestId: number,
    nextStatus: string,
  ): Promise<void> {
    const upper = nextStatus.toUpperCase();
    if (
      upper !== PrStatus.APPROVED &&
      upper !== PrStatus.REJECTED
    ) {
      return;
    }
    const n = await dataSource.getRepository(PurchaseRequestApprovalStep).count(
      { where: { purchase_request_id: purchaseRequestId } },
    );
    if (n > 0) {
      throw new BadRequestException(
        'This purchase request uses the approval workflow. Use the approval decision endpoint to approve or reject.',
      );
    }
  }

  private async loadMatchingApprovalWorkflow(
    manager: EntityManager,
    params: {
      entityId: number;
      subdepartmentId: number;
      centerId: number | null;
      transactionType: string;
    },
  ): Promise<ApprovalWorkflow | null> {
    const repo = manager.getRepository(ApprovalWorkflow);
    const { entityId, subdepartmentId, centerId, transactionType } = params;

    if (centerId !== null && centerId !== undefined && Number(centerId) > 0) {
      const specific = await repo.findOne({
        where: {
          entity_id: entityId,
          transaction_type: transactionType,
          subdepartment_id: subdepartmentId,
          center_id: centerId,
          status: true,
        },
        relations: {
          tiers: { steps: { step_users: true } },
        },
      });
      if (specific) return specific;
    }

    return repo.findOne({
      where: {
        entity_id: entityId,
        transaction_type: transactionType,
        subdepartment_id: subdepartmentId,
        center_id: IsNull(),
        status: true,
      },
      relations: {
        tiers: { steps: { step_users: true } },
      },
    });
  }

  private pickApprovalTierForAmount(
    workflow: ApprovalWorkflow,
    amount: number,
  ): ApprovalWorkflowTier | null {
    const tiers = [...(workflow.tiers ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order,
    );
    for (const tier of tiers) {
      const min = Number(tier.min_amount);
      const max =
        tier.max_amount === null || tier.max_amount === undefined
          ? null
          : Number(tier.max_amount);
      if (amount >= min && (max === null || amount <= max)) {
        return tier;
      }
    }
    return null;
  }

  private buildOrderedWorkflowSteps(
    tier: ApprovalWorkflowTier,
  ): ApprovalWorkflowStep[] {
    const steps = [...(tier.steps ?? [])];
    const reviewers = steps
      .filter((s) => s.step_role === ApprovalWorkflowStepRole.REVIEWER)
      .sort((a, b) => a.sort_order - b.sort_order);
    const approvers = steps
      .filter((s) => s.step_role === ApprovalWorkflowStepRole.APPROVER)
      .sort((a, b) => a.sort_order - b.sort_order);
    return [...reviewers, ...approvers];
  }

  private async bootstrapPurchaseRequestApprovalChain(
    manager: EntityManager,
    purchaseRequest: PurchaseRequest,
    netAmount: number,
  ): Promise<void> {
    const entityId = purchaseRequest.entity_id;
    const subdepartmentId = purchaseRequest.subdepartment_id;
    if (
      entityId === null ||
      entityId === undefined ||
      subdepartmentId === null ||
      subdepartmentId === undefined
    ) {
      throw new BadRequestException(
        'Entity and sub-department are required when submitting a purchase request.',
      );
    }

    const workflow = await this.loadMatchingApprovalWorkflow(manager, {
      entityId,
      subdepartmentId,
      centerId: purchaseRequest.center_id ?? null,
      transactionType: ApprovalWorkflowTransactionType.PURCHASE_REQUEST,
    });

    if (!workflow) {
      throw new BadRequestException(
        PURCHASE_REQUEST_CONSTANTS.NO_APPROVAL_WORKFLOW_MESSAGE,
      );
    }

    const tier = this.pickApprovalTierForAmount(workflow, netAmount);
    if (!tier) {
      throw new BadRequestException(
        PURCHASE_REQUEST_CONSTANTS.NO_APPROVAL_WORKFLOW_MESSAGE,
      );
    }

    const ordered = this.buildOrderedWorkflowSteps(tier);
    if (!ordered.length) {
      throw new BadRequestException(
        PURCHASE_REQUEST_CONSTANTS.NO_APPROVAL_WORKFLOW_MESSAGE,
      );
    }

    const stepRepo = manager.getRepository(PurchaseRequestApprovalStep);
    const assigneeRepo = manager.getRepository(PurchaseRequestApprovalAssignee);

    let seq = 1;
    for (const wfStep of ordered) {
      const stepUsers = [...(wfStep.step_users ?? [])];
      if (!stepUsers.length) {
        throw new BadRequestException(
          'Approval workflow has a step with no assigned users. Update the workflow configuration.',
        );
      }
      const row = await stepRepo.save(
        stepRepo.create({
          purchase_request_id: purchaseRequest.id,
          sequence_order: seq++,
          approval_workflow_step_id: wfStep.id,
          step_role: wfStep.step_role,
          status: PurchaseRequestApprovalStepStatus.PENDING,
          acted_by_user_id: null,
          acted_at: null,
          remarks: null,
        }),
      );
      for (const u of stepUsers) {
        await assigneeRepo.save(
          assigneeRepo.create({
            purchase_request_approval_step_id: row.id,
            user_id: u.user_id,
          }),
        );
      }
    }
  }

  private actorView(user: Users): PurchaseRequestApprovalActorView {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };
  }

  private async loadApprovalStepsSanitized(
    purchaseRequestId: number,
  ): Promise<PurchaseRequestApprovalStepView[]> {
    const stepRepo = dataSource.getRepository(PurchaseRequestApprovalStep);
    const steps = await stepRepo.find({
      where: { purchase_request_id: purchaseRequestId },
      relations: { assignees: { user: true } },
      order: { sequence_order: 'ASC' },
    });

    const actorIds = new Set<number>();
    for (const st of steps) {
      if (st.acted_by_user_id) actorIds.add(st.acted_by_user_id);
    }
    let actorMap = new Map<number, Users>();
    if (actorIds.size) {
      const actors = await dataSource.getRepository(Users).find({
        where: { id: In([...actorIds]) },
      });
      actorMap = new Map(actors.map((u) => [u.id, u]));
    }

    return steps.map((st) => {
      let actedBy: PurchaseRequestApprovalActorView | null = null;
      if (st.acted_by_user_id) {
        const actor = actorMap.get(st.acted_by_user_id);
        if (actor) actedBy = this.actorView(actor);
      }
      return {
        id: st.id,
        purchase_request_id: st.purchase_request_id,
        sequence_order: st.sequence_order,
        approval_workflow_step_id: st.approval_workflow_step_id,
        step_role: st.step_role,
        status: st.status,
        acted_by_user_id: st.acted_by_user_id,
        acted_at: st.acted_at,
        remarks: st.remarks,
        assignees: st.assignees.map((a) => ({
          id: a.id,
          user_id: a.user_id,
          user: this.actorView(a.user),
        })),
        acted_by_user: actedBy,
      };
    });
  }

  private async loadApprovalProgressMap(
    ids: number[],
  ): Promise<Map<number, PurchaseRequestApprovalListProgress>> {
    const map = new Map<number, PurchaseRequestApprovalListProgress>();
    if (!ids.length) return map;
    const unique = [...new Set(ids.filter((id) => Number.isFinite(id)))];
    if (!unique.length) return map;
    try {
      type Raw = {
        purchase_request_id: number;
        total: number | string;
        seq: number | string | null;
        role: string | null;
        rej_seq: number | string | null;
        steps: unknown;
      };
      const rows: Raw[] = await dataSource.query(
        `WITH step_rows AS (
          SELECT purchase_request_id, sequence_order, step_role, status
          FROM purchase_request_approval_step
          WHERE purchase_request_id = ANY($1::int[])
        ),
        totals AS (
          SELECT purchase_request_id, COUNT(*)::int AS total
          FROM step_rows
          GROUP BY purchase_request_id
        ),
        pending AS (
          SELECT DISTINCT ON (purchase_request_id)
            purchase_request_id,
            sequence_order AS seq,
            step_role AS role
          FROM step_rows
          WHERE status = '${PurchaseRequestApprovalStepStatus.PENDING}'
          ORDER BY purchase_request_id, sequence_order ASC
        ),
        rejected AS (
          SELECT DISTINCT ON (purchase_request_id)
            purchase_request_id,
            sequence_order AS rej_seq
          FROM step_rows
          WHERE status = '${PurchaseRequestApprovalStepStatus.REJECTED}'
          ORDER BY purchase_request_id, sequence_order ASC
        ),
        agg AS (
          SELECT purchase_request_id,
            COALESCE(
              json_agg(
                json_build_object(
                  'sequence_order', sequence_order,
                  'step_role', step_role,
                  'status', status
                ) ORDER BY sequence_order
              ),
              '[]'::json
            ) AS steps
          FROM step_rows
          GROUP BY purchase_request_id
        )
        SELECT t.purchase_request_id, t.total, p.seq, p.role, r.rej_seq, a.steps
        FROM totals t
        LEFT JOIN pending p ON p.purchase_request_id = t.purchase_request_id
        LEFT JOIN rejected r ON r.purchase_request_id = t.purchase_request_id
        LEFT JOIN agg a ON a.purchase_request_id = t.purchase_request_id`,
        [unique],
      );
      for (const row of rows) {
        const steps = this.parseApprovalListStepsJson(row.steps);
        map.set(Number(row.purchase_request_id), {
          total_steps: Number(row.total),
          current_step: row.seq == null ? null : Number(row.seq),
          current_role: row.role,
          rejected_at_step: row.rej_seq == null ? null : Number(row.rej_seq),
          steps,
        });
      }
    } catch {
    }
    return map;
  }

  private parseApprovalListStepsJson(raw: unknown): PurchaseRequestApprovalListStep[] {
    if (raw == null) return [];
    let parsed: unknown = raw;
    if (typeof raw === 'string') {
      try {
        parsed = JSON.parse(raw) as unknown;
      } catch {
        return [];
      }
    }
    if (!Array.isArray(parsed)) return [];
    const out: PurchaseRequestApprovalListStep[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== 'object') continue;
      const o = item as Record<string, unknown>;
      out.push({
        sequence_order: Number(o.sequence_order),
        step_role: String(o.step_role ?? ''),
        status: String(o.status ?? ''),
      });
    }
    return out;
  }

  private async attachApprovalProgressToRows<T extends PurchaseRequest>(
    rows: T[],
  ): Promise<Array<T & { approval_progress: PurchaseRequestApprovalListProgress | null }>> {
    const progressMap = await this.loadApprovalProgressMap(
      rows.map((r) => r.id),
    );
    return rows.map((row) => ({
      ...(row as unknown as PurchaseRequest),
      approval_progress: progressMap.get(row.id) ?? null,
    })) as Array<
      T & { approval_progress: PurchaseRequestApprovalListProgress | null }
    >;
  }

  async create(
    createDto: CreatePurchaseRequestDto,
    userEmailId: string | null,
  ): Promise<PurchaseRequest> {
    return dataSource.transaction(async (manager) => {
      const purchaseRequestRepository = manager.getRepository(PurchaseRequest);
      const purchaseRequestItemRepository =
        manager.getRepository(PurchaseRequestItem);

      let purchaseRequestNumber = createDto.pr_number?.trim() || null;
      if (purchaseRequestNumber) {
        const existingByNumber = await purchaseRequestRepository
          .createQueryBuilder('purchaseRequest')
          .where(
            'LOWER(purchaseRequest.pr_number) = LOWER(:purchaseRequestNumber)',
            { purchaseRequestNumber },
          )
          .getOne();
        if (existingByNumber) {
          throw new ConflictException(
            `PR number "${purchaseRequestNumber}" already exists`,
          );
        }
      } else {
        purchaseRequestNumber =
          await this.generatePurchaseRequestNumber(manager);
      }

      const itemsWithComputedAmount = createDto.items.map((item) => ({
        ...item,
        amount: this.computeItemAmount(item),
      }));
      const computedNetAmount =
        createDto.net_amount ?? this.sumItemsAmount(itemsWithComputedAmount);

      const statusUpper = this.normalizePrStatus(
        createDto.status ?? PrStatus.SUBMITTED,
      );
      if (
        statusUpper !== PrStatus.DRAFT &&
        statusUpper !== PrStatus.SUBMITTED
      ) {
        throw new BadRequestException(
          'Purchase request status must be DRAFT or SUBMITTED when creating.',
        );
      }

      const purchaseRequestHeader = purchaseRequestRepository.create({
        pr_number: purchaseRequestNumber,
        entity_id: createDto.entity_id ?? null,
        vendor_id: createDto.vendor_id ?? null,
        vendor_site_id: createDto.vendor_site_id ?? null,
        item_type_id: createDto.item_type_id ?? null,
        validity_from: createDto.validity_from
          ? new Date(createDto.validity_from)
          : null,
        validity_to: createDto.validity_to
          ? new Date(createDto.validity_to)
          : null,
        required_date: createDto.required_date
          ? new Date(createDto.required_date)
          : null,
        frequency: createDto.frequency ?? null,
        department_id: createDto.department_id ?? null,
        subdepartment_id: createDto.subdepartment_id ?? null,
        payment_term_id: createDto.payment_term_id ?? null,
        terms_conditions: createDto.terms_conditions ?? null,
        center_id: createDto.center_id ?? null,
        remarks: createDto.remarks ?? null,
        overall_summary: createDto.overall_summary ?? null,
        net_amount: this.toMoney(computedNetAmount),
        status:
          statusUpper === PrStatus.DRAFT
            ? PrStatus.DRAFT
            : PrStatus.SUBMITTED,
        created_by: userEmailId ?? createDto.created_by ?? null,
        created_date: new Date(),
        updated_by: userEmailId ?? createDto.created_by ?? null,
        updated_date: new Date(),
      });
      const savedPurchaseRequest = await purchaseRequestRepository.save(
        purchaseRequestHeader,
      );

      const purchaseRequestItemsToSave = itemsWithComputedAmount.map((item) =>
        purchaseRequestItemRepository.create({
          purchase_request_id: savedPurchaseRequest.id,
          item_id: item.item_id ?? null,
          description: item.description ?? null,
          quantity: this.toMoney(item.quantity),
          estimated_rate: this.toMoney(item.estimated_rate),
          amount: this.toMoney(item.amount),
          remarks: item.remarks ?? null,
          created_by: userEmailId ?? null,
          created_date: new Date(),
          updated_by: userEmailId ?? null,
          updated_date: new Date(),
        }),
      );
      await purchaseRequestItemRepository.save(purchaseRequestItemsToSave);

      if (this.submissionStatusRequiresWorkflow(statusUpper)) {
        await this.bootstrapPurchaseRequestApprovalChain(
          manager,
          savedPurchaseRequest,
          Number(computedNetAmount),
        );
      }

      const reloadedPurchaseRequest = await purchaseRequestRepository.findOne({
        where: { id: savedPurchaseRequest.id },
      });
      return reloadedPurchaseRequest as PurchaseRequest;
    });
  }

  async findAll(
    filter: GetPurchaseRequestFilterDto,
  ): Promise<PageDto<PurchaseRequest> | PurchaseRequestListResponse> {
    const {
      search,
      status,
      vendor_id,
      entity_id,
      department_id,
      center_id,
      from_date,
      to_date,
      orderBy,
      order,
    } = filter;

    const purchaseRequestQueryBuilder = purchaseRequestRepository.createQueryBuilder(
      'purchaseRequest',
    )
      .leftJoin('purchaseRequest.vendor', 'vendor')
      .leftJoin('purchaseRequest.vendor_site', 'vendor_site')
      .leftJoin('purchaseRequest.entity', 'entity')
      .leftJoin('purchaseRequest.department', 'department')
      .leftJoin('purchaseRequest.subdepartment', 'subdepartment')
      .leftJoin('purchaseRequest.payment_term', 'payment_term')
      .leftJoin('purchaseRequest.center', 'center')
      .leftJoin('purchaseRequest.item_type', 'item_type')
      .select([
        'purchaseRequest.id',
        'purchaseRequest.pr_number',
        'purchaseRequest.entity_id',
        'purchaseRequest.vendor_id',
        'purchaseRequest.vendor_site_id',
        'purchaseRequest.item_type_id',
        'purchaseRequest.department_id',
        'purchaseRequest.subdepartment_id',
        'purchaseRequest.payment_term_id',
        'purchaseRequest.center_id',
        'purchaseRequest.validity_from',
        'purchaseRequest.validity_to',
        'purchaseRequest.required_date',
        'purchaseRequest.frequency',
        'purchaseRequest.net_amount',
        'purchaseRequest.status',
        'purchaseRequest.created_by',
        'purchaseRequest.created_date',
        'purchaseRequest.updated_by',
        'purchaseRequest.updated_date',
        'vendor.id',
        'vendor.code',
        'vendor.name',
        'vendor_site.id',
        'vendor_site.site_code',
        'vendor_site.site_name',
        'entity.id',
        'entity.code',
        'entity.name',
        'department.id',
        'department.code',
        'department.name',
        'subdepartment.id',
        'subdepartment.code',
        'subdepartment.name',
        'payment_term.id',
        'payment_term.code',
        'payment_term.name',
        'center.id',
        'center.code',
        'center.name',
        'item_type.id',
        'item_type.code',
        'item_type.name',
      ]);

    if (search) {
      purchaseRequestQueryBuilder.andWhere(
        '(LOWER(purchaseRequest.pr_number) LIKE LOWER(:search) OR LOWER(vendor.name) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    if (status) {
      const u = String(status).toUpperCase();
      if (u === PrStatus.SUBMITTED || u === PrStatus.PENDING) {
        purchaseRequestQueryBuilder.andWhere(
          'purchaseRequest.status IN (:...pendingStatuses)',
          {
            pendingStatuses: [PrStatus.SUBMITTED, PrStatus.PENDING],
          },
        );
      } else {
        purchaseRequestQueryBuilder.andWhere(
          'purchaseRequest.status = :status',
          { status },
        );
      }
    }
    if (vendor_id) {
      purchaseRequestQueryBuilder.andWhere(
        'purchaseRequest.vendor_id = :vendorId',
        { vendorId: vendor_id },
      );
    }
    if (entity_id) {
      purchaseRequestQueryBuilder.andWhere(
        'purchaseRequest.entity_id = :entityId',
        { entityId: entity_id },
      );
    }
    if (department_id) {
      purchaseRequestQueryBuilder.andWhere(
        'purchaseRequest.department_id = :departmentId',
        { departmentId: department_id },
      );
    }
    if (center_id) {
      purchaseRequestQueryBuilder.andWhere(
        'purchaseRequest.center_id = :centerId',
        { centerId: center_id },
      );
    }
    if (from_date) {
      purchaseRequestQueryBuilder.andWhere(
        'purchaseRequest.created_date >= :fromDate',
        { fromDate: new Date(from_date) },
      );
    }
    if (to_date) {
      purchaseRequestQueryBuilder.andWhere(
        'purchaseRequest.created_date <= :toDate',
        { toDate: new Date(to_date) },
      );
    }

    const sortColumn = orderBy ?? 'created_date';
    purchaseRequestQueryBuilder.orderBy(
      `purchaseRequest.${sortColumn}`,
      order,
    );

    if (String(filter.noLimit) === 'true') {
      const [rows, count] =
        await purchaseRequestQueryBuilder.getManyAndCount();
      const enriched = await this.attachApprovalProgressToRows(rows);
      return { rows: enriched, count };
    }

    purchaseRequestQueryBuilder.skip(filter.skip).take(filter.take);
    const itemCount = await purchaseRequestQueryBuilder.getCount();
    const { entities } = await purchaseRequestQueryBuilder.getRawAndEntities();

    const pageOptionsDto: PageOptionsDto = {
      take: filter.take,
      createdDate: new Date(),
      order: filter.order,
      skip: filter.skip,
    } as PageOptionsDto;
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    const enriched = await this.attachApprovalProgressToRows(entities);
    return new PageDto(
      enriched as unknown as PurchaseRequest[],
      pageMetaDto,
    );
  }

  async getStatusCounts(): Promise<{
    ALL: number;
    PENDING: number;
    APPROVED: number;
    REJECTED: number;
  }> {
    const rows: { status: string | null; count: string }[] =
      await purchaseRequestRepository.createQueryBuilder('purchaseRequest')
        .select('purchaseRequest.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('purchaseRequest.status')
        .getRawMany();

    let all = 0;
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    for (const row of rows) {
      const raw = (row.status ?? '').toUpperCase();
      const value = Number(row.count) || 0;
      all += value;
      if (raw === PrStatus.SUBMITTED || raw === PrStatus.PENDING) {
        pending += value;
      } else if (raw === PrStatus.APPROVED) {
        approved += value;
      } else if (raw === PrStatus.REJECTED) {
        rejected += value;
      }
    }

    return { ALL: all, PENDING: pending, APPROVED: approved, REJECTED: rejected };
  }

  async findOne(purchaseRequestId: number): Promise<
    PurchaseRequest & {
      items: PurchaseRequestItem[];
      documents: PurchaseRequestDocument[];
      approval_steps: PurchaseRequestApprovalStepView[];
    }
  > {
    const purchaseRequest = await purchaseRequestRepository.findOne({
      where: { id: purchaseRequestId },
      relations: {
        vendor: true,
        vendor_site: true,
        entity: true,
        department: true,
        subdepartment: true,
        payment_term: true,
        center: true,
        item_type: true,
      },
    });
    if (!purchaseRequest) {
      throw new NotFoundException(
        `Purchase request id=${purchaseRequestId} not found`,
      );
    }

    const [items, documents] = await Promise.all([
      purchaseRequestItemRepository.find({
        where: { purchase_request_id: purchaseRequestId },
        relations: { item: true },
        order: { id: 'ASC' },
      }),
      purchaseRequestDocumentRepository.find({
        where: { purchase_request_id: purchaseRequestId },
        order: { id: 'ASC' },
      }),
    ]);

    let approval_steps: PurchaseRequestApprovalStepView[] = [];
    try {
      approval_steps = await this.loadApprovalStepsSanitized(
        purchaseRequestId,
      );
    } catch {
      approval_steps = [];
    }

    return {
      ...(purchaseRequest as PurchaseRequest),
      items,
      documents,
      approval_steps,
    };
  }

  async findOneApprovalTrail(
    purchaseRequestId: number,
  ): Promise<PurchaseRequestApprovalTrailDto> {
    const purchaseRequest = await purchaseRequestRepository.findOne({
      where: { id: purchaseRequestId },
      select: { id: true, status: true },
    });
    if (!purchaseRequest) {
      throw new NotFoundException(
        `Purchase request id=${purchaseRequestId} not found`,
      );
    }
    let approval_steps: PurchaseRequestApprovalStepView[] = [];
    try {
      approval_steps = await this.loadApprovalStepsSanitized(
        purchaseRequestId,
      );
    } catch {
      approval_steps = [];
    }
    return {
      id: purchaseRequest.id,
      status: String(purchaseRequest.status ?? ''),
      approval_steps,
    };
  }

  async update(
    purchaseRequestId: number,
    updateDto: UpdatePurchaseRequestDto,
    userEmailId: string | null,
  ): Promise<PurchaseRequest> {
    return dataSource.transaction(async (manager) => {
      const purchaseRequestRepository = manager.getRepository(PurchaseRequest);
      const purchaseRequestItemRepository =
        manager.getRepository(PurchaseRequestItem);

      const purchaseRequest = await purchaseRequestRepository.findOne({
        where: { id: purchaseRequestId },
      });
      if (!purchaseRequest) {
        throw new NotFoundException(
          `Purchase request id=${purchaseRequestId} not found`,
        );
      }

      const previousStatusUpper = this.normalizePrStatus(
        purchaseRequest.status,
      );

      if (
        updateDto.pr_number &&
        updateDto.pr_number !== purchaseRequest.pr_number
      ) {
        const existingByNumber = await purchaseRequestRepository
          .createQueryBuilder('purchaseRequest')
          .where(
            'LOWER(purchaseRequest.pr_number) = LOWER(:purchaseRequestNumber)',
            { purchaseRequestNumber: updateDto.pr_number },
          )
          .andWhere('purchaseRequest.id != :purchaseRequestId', {
            purchaseRequestId,
          })
          .getOne();
        if (existingByNumber) {
          throw new ConflictException(
            `PR number "${updateDto.pr_number}" already exists`,
          );
        }
        purchaseRequest.pr_number = updateDto.pr_number;
      }

      const assignIfDefined = <K extends keyof PurchaseRequest>(
        key: K,
        value: PurchaseRequest[K] | undefined,
      ) => {
        if (value !== undefined) purchaseRequest[key] = value;
      };

      assignIfDefined('entity_id', updateDto.entity_id ?? null);
      assignIfDefined('vendor_id', updateDto.vendor_id ?? null);
      assignIfDefined('vendor_site_id', updateDto.vendor_site_id ?? null);
      assignIfDefined('item_type_id', updateDto.item_type_id ?? null);
      assignIfDefined(
        'validity_from',
        updateDto.validity_from === undefined
          ? undefined
          : updateDto.validity_from === null
            ? null
            : new Date(updateDto.validity_from),
      );
      assignIfDefined(
        'validity_to',
        updateDto.validity_to === undefined
          ? undefined
          : updateDto.validity_to === null
            ? null
            : new Date(updateDto.validity_to),
      );
      assignIfDefined(
        'required_date',
        updateDto.required_date === undefined
          ? undefined
          : updateDto.required_date === null
            ? null
            : new Date(updateDto.required_date),
      );
      assignIfDefined('frequency', updateDto.frequency ?? null);
      assignIfDefined('department_id', updateDto.department_id ?? null);
      assignIfDefined('subdepartment_id', updateDto.subdepartment_id ?? null);
      assignIfDefined('payment_term_id', updateDto.payment_term_id ?? null);
      assignIfDefined('terms_conditions', updateDto.terms_conditions ?? null);
      assignIfDefined('center_id', updateDto.center_id ?? null);
      assignIfDefined('remarks', updateDto.remarks ?? null);
      assignIfDefined('overall_summary', updateDto.overall_summary ?? null);
      assignIfDefined('status', updateDto.status);

      if (updateDto.items) {
        const incomingItemIds = updateDto.items
          .map((item) => item.id)
          .filter((value): value is number => typeof value === 'number');

        const existingItems = await purchaseRequestItemRepository.find({
          where: { purchase_request_id: purchaseRequestId },
        });
        const itemsToDelete = existingItems.filter(
          (existingItem) => !incomingItemIds.includes(existingItem.id),
        );
        if (itemsToDelete.length) {
          await purchaseRequestItemRepository.delete({
            id: In(itemsToDelete.map((existingItem) => existingItem.id)),
          });
        }

        const itemsToUpsert: PurchaseRequestItem[] = [];
        for (const incomingItem of updateDto.items) {
          const computedAmount = this.computeItemAmount(incomingItem);
          if (incomingItem.id) {
            const existingItem = existingItems.find(
              (candidate) => candidate.id === incomingItem.id,
            );
            if (!existingItem) {
              throw new NotFoundException(
                `Item id=${incomingItem.id} not found on PR`,
              );
            }
            if (incomingItem.item_id !== undefined) {
              existingItem.item_id = incomingItem.item_id ?? null;
            }
            if (incomingItem.description !== undefined) {
              existingItem.description = incomingItem.description ?? null;
            }
            if (incomingItem.quantity !== undefined) {
              existingItem.quantity = this.toMoney(incomingItem.quantity);
            }
            if (incomingItem.estimated_rate !== undefined) {
              existingItem.estimated_rate = this.toMoney(
                incomingItem.estimated_rate,
              );
            }
            existingItem.amount = this.toMoney(computedAmount);
            if (incomingItem.remarks !== undefined) {
              existingItem.remarks = incomingItem.remarks ?? null;
            }
            existingItem.updated_by = userEmailId ?? null;
            existingItem.updated_date = new Date();
            this.assertValidPrLineItem(
              `Line item ${incomingItem.id}`,
              existingItem.item_id,
              existingItem.quantity,
              existingItem.estimated_rate,
            );
            itemsToUpsert.push(existingItem);
          } else {
            this.assertValidPrLineItem(
              'New line item',
              incomingItem.item_id,
              incomingItem.quantity,
              incomingItem.estimated_rate,
            );
            itemsToUpsert.push(
              purchaseRequestItemRepository.create({
                purchase_request_id: purchaseRequestId,
                item_id: incomingItem.item_id ?? null,
                description: incomingItem.description ?? null,
                quantity: this.toMoney(incomingItem.quantity ?? 0),
                estimated_rate: this.toMoney(
                  incomingItem.estimated_rate ?? 0,
                ),
                amount: this.toMoney(computedAmount),
                remarks: incomingItem.remarks ?? null,
                created_by: userEmailId ?? null,
                created_date: new Date(),
                updated_by: userEmailId ?? null,
                updated_date: new Date(),
              }),
            );
          }
        }
        if (itemsToUpsert.length) {
          await purchaseRequestItemRepository.save(itemsToUpsert);
        }

        if (updateDto.net_amount === undefined) {
          const totalAmount = itemsToUpsert.reduce(
            (accumulator, item) => accumulator + Number(item.amount ?? 0),
            0,
          );
          purchaseRequest.net_amount = this.toMoney(totalAmount);
        }
      }
      if (updateDto.net_amount !== undefined) {
        purchaseRequest.net_amount = this.toMoney(updateDto.net_amount);
      }

      purchaseRequest.updated_by =
        userEmailId ?? updateDto.updated_by ?? null;
      purchaseRequest.updated_date = new Date();

      if (updateDto.status !== undefined) {
        await this.assertDirectApproveRejectNotUsed(
          purchaseRequestId,
          String(updateDto.status),
        );
      }

      const effectiveStatusUpper = this.normalizePrStatus(
        purchaseRequest.status,
      );
      if (
        this.submissionStatusRequiresWorkflow(effectiveStatusUpper) &&
        previousStatusUpper === PrStatus.DRAFT
      ) {
        const existingSteps = await manager.count(
          PurchaseRequestApprovalStep,
          { where: { purchase_request_id: purchaseRequestId } },
        );
        if (existingSteps === 0) {
          await this.bootstrapPurchaseRequestApprovalChain(
            manager,
            purchaseRequest,
            Number(purchaseRequest.net_amount ?? 0),
          );
        }
      }

      await purchaseRequestRepository.save(purchaseRequest);
      const reloadedPurchaseRequest = await purchaseRequestRepository.findOne({
        where: { id: purchaseRequestId },
      });
      return reloadedPurchaseRequest as PurchaseRequest;
    });
  }

  async updateStatus(
    purchaseRequestId: number,
    statusDto: UpdatePurchaseRequestStatusDto,
    userEmailId: string | null,
  ): Promise<PurchaseRequest> {
    return dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(PurchaseRequest);
      const purchaseRequest = await repo.findOne({
        where: { id: purchaseRequestId },
      });
      if (!purchaseRequest) {
        throw new NotFoundException(
          `Purchase request id=${purchaseRequestId} not found`,
        );
      }

      const previousStatusUpper = this.normalizePrStatus(
        purchaseRequest.status,
      );
      const nextStatusUpper = this.normalizePrStatus(statusDto.status);

      await this.assertDirectApproveRejectNotUsed(
        purchaseRequestId,
        statusDto.status,
      );

      purchaseRequest.status = statusDto.status;
      purchaseRequest.updated_by =
        userEmailId ?? statusDto.updated_by ?? null;
      purchaseRequest.updated_date = new Date();
      await repo.save(purchaseRequest);

      if (
        this.submissionStatusRequiresWorkflow(nextStatusUpper) &&
        previousStatusUpper === PrStatus.DRAFT
      ) {
        const existingSteps = await manager.count(
          PurchaseRequestApprovalStep,
          { where: { purchase_request_id: purchaseRequestId } },
        );
        if (existingSteps === 0) {
          await this.bootstrapPurchaseRequestApprovalChain(
            manager,
            purchaseRequest,
            Number(purchaseRequest.net_amount ?? 0),
          );
        }
      }

      const reloaded = await repo.findOne({ where: { id: purchaseRequestId } });
      return reloaded as PurchaseRequest;
    });
  }

  async recordApprovalDecision(
    purchaseRequestId: number,
    actingUserId: number,
    userEmailId: string | null,
    dto: PurchaseRequestApprovalDecisionDto,
  ): Promise<
    PurchaseRequest & {
      items: PurchaseRequestItem[];
      documents: PurchaseRequestDocument[];
      approval_steps: PurchaseRequestApprovalStepView[];
    }
  > {
    await dataSource.transaction(async (manager) => {
      const prRepo = manager.getRepository(PurchaseRequest);
      const pr = await prRepo.findOne({ where: { id: purchaseRequestId } });
      if (!pr) {
        throw new NotFoundException(
          `Purchase request id=${purchaseRequestId} not found`,
        );
      }

      const prStatus = this.normalizePrStatus(pr.status);
      if (prStatus !== PrStatus.SUBMITTED) {
        throw new BadRequestException(
          'This purchase request is not awaiting approval.',
        );
      }

      const stepRepo = manager.getRepository(PurchaseRequestApprovalStep);
      const pendingStep = await stepRepo.findOne({
        where: {
          purchase_request_id: purchaseRequestId,
          status: PurchaseRequestApprovalStepStatus.PENDING,
        },
        order: { sequence_order: 'ASC' },
        relations: { assignees: true },
      });

      if (!pendingStep) {
        throw new BadRequestException('No pending approval step.');
      }

      const mayAct = pendingStep.assignees.some(
        (a) => a.user_id === actingUserId,
      );
      if (!mayAct) {
        throw new ForbiddenException(
          'You are not assigned to the current approval step.',
        );
      }

      const now = new Date();
      const remarks = dto.remarks ?? null;

      if (dto.decision === PurchaseRequestApprovalDecision.REJECT) {
        pendingStep.status = PurchaseRequestApprovalStepStatus.REJECTED;
        pendingStep.acted_by_user_id = actingUserId;
        pendingStep.acted_at = now;
        pendingStep.remarks = remarks;
        await stepRepo.save(pendingStep);

        pr.status = PrStatus.REJECTED;
        pr.updated_by = userEmailId;
        pr.updated_date = now;
        await prRepo.save(pr);
        return;
      }

      pendingStep.status = PurchaseRequestApprovalStepStatus.APPROVED;
      pendingStep.acted_by_user_id = actingUserId;
      pendingStep.acted_at = now;
      pendingStep.remarks = remarks;
      await stepRepo.save(pendingStep);

      const stillPending = await stepRepo.count({
        where: {
          purchase_request_id: purchaseRequestId,
          status: PurchaseRequestApprovalStepStatus.PENDING,
        },
      });
      if (stillPending === 0) {
        pr.status = PrStatus.APPROVED;
        pr.updated_by = userEmailId;
        pr.updated_date = now;
        await prRepo.save(pr);
      }
    });

    return this.findOne(purchaseRequestId);
  }

  async remove(purchaseRequestId: number): Promise<DeleteResult> {
    const result = await purchaseRequestRepository.delete({
      id: purchaseRequestId,
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException(
      `Purchase request id=${purchaseRequestId} not found`,
    );
  }

  async addItem(
    purchaseRequestId: number,
    createItemDto: CreatePurchaseRequestItemDto,
    userEmailId: string | null,
  ): Promise<PurchaseRequestItem> {
    await this.assertPurchaseRequestExists(purchaseRequestId);
    const computedAmount = this.computeItemAmount(createItemDto);
    const newItem = purchaseRequestItemRepository.create({
      purchase_request_id: purchaseRequestId,
      item_id: createItemDto.item_id ?? null,
      description: createItemDto.description ?? null,
      quantity: this.toMoney(createItemDto.quantity),
      estimated_rate: this.toMoney(createItemDto.estimated_rate),
      amount: this.toMoney(computedAmount),
      remarks: createItemDto.remarks ?? null,
      created_by: userEmailId ?? null,
      created_date: new Date(),
      updated_by: userEmailId ?? null,
      updated_date: new Date(),
    });
    const savedItem = await purchaseRequestItemRepository.save(newItem);
    await this.recomputeNetAmount(purchaseRequestId);
    return savedItem;
  }

  async updateItem(
    purchaseRequestId: number,
    itemId: number,
    updateItemDto: UpdatePurchaseRequestItemDto,
    userEmailId: string | null,
  ): Promise<PurchaseRequestItem> {
    await this.assertPurchaseRequestExists(purchaseRequestId);
    const existingItem = await purchaseRequestItemRepository.findOne({
      where: { id: itemId, purchase_request_id: purchaseRequestId },
    });
    if (!existingItem) {
      throw new NotFoundException(
        `Item id=${itemId} not found on PR ${purchaseRequestId}`,
      );
    }
    if (updateItemDto.item_id !== undefined) {
      existingItem.item_id = updateItemDto.item_id ?? null;
    }
    if (updateItemDto.description !== undefined) {
      existingItem.description = updateItemDto.description ?? null;
    }
    if (updateItemDto.quantity !== undefined) {
      existingItem.quantity = this.toMoney(updateItemDto.quantity);
    }
    if (updateItemDto.estimated_rate !== undefined) {
      existingItem.estimated_rate = this.toMoney(
        updateItemDto.estimated_rate,
      );
    }
    existingItem.amount = this.toMoney(
      this.computeItemAmount({
        quantity:
          updateItemDto.quantity !== undefined
            ? updateItemDto.quantity
            : Number(existingItem.quantity),
        estimated_rate:
          updateItemDto.estimated_rate !== undefined
            ? updateItemDto.estimated_rate
            : Number(existingItem.estimated_rate),
        amount: updateItemDto.amount,
      }),
    );
    if (updateItemDto.remarks !== undefined) {
      existingItem.remarks = updateItemDto.remarks ?? null;
    }
    existingItem.updated_by = userEmailId ?? null;
    existingItem.updated_date = new Date();

    this.assertValidPrLineItem(
      `Line item ${itemId}`,
      existingItem.item_id,
      existingItem.quantity,
      existingItem.estimated_rate,
    );

    const savedItem = await purchaseRequestItemRepository.save(existingItem);
    await this.recomputeNetAmount(purchaseRequestId);
    return savedItem;
  }

  async removeItem(
    purchaseRequestId: number,
    itemId: number,
  ): Promise<DeleteResult> {
    await this.assertPurchaseRequestExists(purchaseRequestId);
    const result = await purchaseRequestItemRepository.delete({
      id: itemId,
      purchase_request_id: purchaseRequestId,
    });
    if (!result?.affected) {
      throw new NotFoundException(
        `Item id=${itemId} not found on PR ${purchaseRequestId}`,
      );
    }
    await this.recomputeNetAmount(purchaseRequestId);
    return result;
  }

  private async recomputeNetAmount(
    purchaseRequestId: number,
  ): Promise<void> {
    const items = await purchaseRequestItemRepository.find({
      where: { purchase_request_id: purchaseRequestId },
    });
    const totalAmount = items.reduce(
      (accumulator, item) => accumulator + Number(item.amount ?? 0),
      0,
    );
    await purchaseRequestRepository.update(purchaseRequestId, {
      net_amount: this.toMoney(totalAmount),
      updated_date: new Date(),
    });
  }

  async listDocuments(
    purchaseRequestId: number,
  ): Promise<PurchaseRequestDocument[]> {
    await this.assertPurchaseRequestExists(purchaseRequestId);
    return purchaseRequestDocumentRepository.find({
      where: { purchase_request_id: purchaseRequestId },
      order: { id: 'ASC' },
    });
  }

  async addDocument(
    purchaseRequestId: number,
    createDocumentDto: CreatePurchaseRequestDocumentDto,
    userEmailId: string | null,
  ): Promise<PurchaseRequestDocument> {
    await this.assertPurchaseRequestExists(purchaseRequestId);
    const newDocument = purchaseRequestDocumentRepository.create({
      purchase_request_id: purchaseRequestId,
      file_name: createDocumentDto.file_name,
      file_path: createDocumentDto.file_path,
      file_type: createDocumentDto.file_type ?? null,
      file_size:
        createDocumentDto.file_size === undefined ||
        createDocumentDto.file_size === null
          ? null
          : String(createDocumentDto.file_size),
      uploaded_by: userEmailId ?? null,
      uploaded_date: new Date(),
    });
    return purchaseRequestDocumentRepository.save(newDocument);
  }

  async updateDocument(
    purchaseRequestId: number,
    documentId: number,
    updateDocumentDto: UpdatePurchaseRequestDocumentDto,
  ): Promise<PurchaseRequestDocument> {
    await this.assertPurchaseRequestExists(purchaseRequestId);
    const existingDocument = await purchaseRequestDocumentRepository.findOne({
      where: {
        id: documentId,
        purchase_request_id: purchaseRequestId,
      },
    });
    if (!existingDocument) {
      throw new NotFoundException(
        `Document id=${documentId} not found on PR ${purchaseRequestId}`,
      );
    }
    if (updateDocumentDto.file_name !== undefined) {
      existingDocument.file_name = updateDocumentDto.file_name;
    }
    if (updateDocumentDto.file_path !== undefined) {
      existingDocument.file_path = updateDocumentDto.file_path;
    }
    if (updateDocumentDto.file_type !== undefined) {
      existingDocument.file_type = updateDocumentDto.file_type ?? null;
    }
    if (updateDocumentDto.file_size !== undefined) {
      existingDocument.file_size =
        updateDocumentDto.file_size === null
          ? null
          : String(updateDocumentDto.file_size);
    }
    return purchaseRequestDocumentRepository.save(existingDocument);
  }

  async removeDocument(
    purchaseRequestId: number,
    documentId: number,
  ): Promise<DeleteResult> {
    await this.assertPurchaseRequestExists(purchaseRequestId);
    const result = await purchaseRequestDocumentRepository.delete({
      id: documentId,
      purchase_request_id: purchaseRequestId,
    });
    if (!result?.affected) {
      throw new NotFoundException(
        `Document id=${documentId} not found on PR ${purchaseRequestId}`,
      );
    }
    return result;
  }
}
