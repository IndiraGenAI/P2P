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
  PurchaseOrder,
  PurchaseOrderApprovalAssignee,
  PurchaseOrderApprovalStep,
  PurchaseOrderDocument,
  PurchaseOrderItem,
  Users,
} from 'erp-db';
import { DeleteResult, EntityManager, In, IsNull } from 'typeorm';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { PURCHASE_ORDER_CONSTANTS } from 'src/commons/constant';
import {
  PrStatus,
  PurchaseRequestApprovalDecision,
  PurchaseRequestApprovalStepStatus,
} from 'src/commons/enum';
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
import {
  PurchaseOrderApprovalActorView,
  PurchaseOrderApprovalListProgress,
  PurchaseOrderApprovalListStep,
  PurchaseOrderApprovalStepView,
  PurchaseOrderApprovalTrailDto,
  PurchaseOrderListResponse,
} from './dto/purchase-order-approval-view.dto';
import { purchaseOrderRepository } from './repository/purchase-order.repository';
import { purchaseOrderDocumentRepository } from './repository/purchase-order-document.repository';
import { purchaseOrderItemRepository } from './repository/purchase-order-item.repository';

@Injectable()
export class PurchaseOrderService {
  private async assertPurchaseOrderExists(
    purchaseOrderId: number,
  ): Promise<PurchaseOrder> {
    const existingPurchaseOrder = await purchaseOrderRepository.findOne({
      where: { id: purchaseOrderId },
    });
    if (!existingPurchaseOrder) {
      throw new NotFoundException(
        `Purchase order id=${purchaseOrderId} not found`,
      );
    }
    return existingPurchaseOrder;
  }

  private async generatePurchaseOrderNumber(
    manager?: EntityManager,
  ): Promise<string> {
    const repository = manager
      ? manager.getRepository(PurchaseOrder)
      : purchaseOrderRepository;

    const lastRecord = await repository
      .createQueryBuilder('purchaseOrder')
      .select('purchaseOrder.po_number', 'po_number')
      .where("purchaseOrder.po_number ~ '^PO-[0-9]+$'")
      .orderBy(
        'CAST(SUBSTRING(purchaseOrder.po_number FROM 4) AS INTEGER)',
        'DESC',
      )
      .limit(1)
      .getRawOne<{ po_number: string }>();

    let nextNumber = 1;
    if (lastRecord?.po_number) {
      const numberPart = parseInt(lastRecord.po_number.replace(/\D/g, ''), 10);
      if (!Number.isNaN(numberPart)) nextNumber = numberPart + 1;
    }
    return `${PURCHASE_ORDER_CONSTANTS.NUMBER_PREFIX}${String(nextNumber).padStart(
      PURCHASE_ORDER_CONSTANTS.NUMBER_PAD,
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
    items: {
      amount?: number | string | null;
      net_line_amount?: number | string | null;
    }[],
  ): number {
    return items.reduce((totalAmount, item) => {
      const line =
        item.net_line_amount !== undefined && item.net_line_amount !== null
          ? Number(item.net_line_amount)
          : Number(item.amount ?? 0);
      return totalAmount + line;
    }, 0);
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
    purchaseOrderId: number,
    nextStatus: string,
  ): Promise<void> {
    const upper = nextStatus.toUpperCase();
    if (
      upper !== PrStatus.APPROVED &&
      upper !== PrStatus.REJECTED
    ) {
      return;
    }
    const n = await dataSource.getRepository(PurchaseOrderApprovalStep).count(
      { where: { purchase_order_id: purchaseOrderId } },
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

  private async bootstrapPurchaseOrderApprovalChain(
    manager: EntityManager,
    purchaseOrder: PurchaseOrder,
    netAmount: number,
  ): Promise<void> {
    const entityId = purchaseOrder.entity_id;
    const subdepartmentId = purchaseOrder.subdepartment_id;
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
      centerId: purchaseOrder.center_id ?? null,
      transactionType: ApprovalWorkflowTransactionType.PURCHASE_ORDER,
    });

    if (!workflow) {
      throw new BadRequestException(
        PURCHASE_ORDER_CONSTANTS.NO_APPROVAL_WORKFLOW_MESSAGE,
      );
    }

    const tier = this.pickApprovalTierForAmount(workflow, netAmount);
    if (!tier) {
      throw new BadRequestException(
        PURCHASE_ORDER_CONSTANTS.NO_APPROVAL_WORKFLOW_MESSAGE,
      );
    }

    const ordered = this.buildOrderedWorkflowSteps(tier);
    if (!ordered.length) {
      throw new BadRequestException(
        PURCHASE_ORDER_CONSTANTS.NO_APPROVAL_WORKFLOW_MESSAGE,
      );
    }

    const stepRepo = manager.getRepository(PurchaseOrderApprovalStep);
    const assigneeRepo = manager.getRepository(PurchaseOrderApprovalAssignee);

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
          purchase_order_id: purchaseOrder.id,
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
            purchase_order_approval_step_id: row.id,
            user_id: u.user_id,
          }),
        );
      }
    }
  }

  private actorView(user: Users): PurchaseOrderApprovalActorView {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };
  }

  private async loadApprovalStepsSanitized(
    purchaseOrderId: number,
  ): Promise<PurchaseOrderApprovalStepView[]> {
    const stepRepo = dataSource.getRepository(PurchaseOrderApprovalStep);
    const steps = await stepRepo.find({
      where: { purchase_order_id: purchaseOrderId },
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
      let actedBy: PurchaseOrderApprovalActorView | null = null;
      if (st.acted_by_user_id) {
        const actor = actorMap.get(st.acted_by_user_id);
        if (actor) actedBy = this.actorView(actor);
      }
      return {
        id: st.id,
        purchase_order_id: st.purchase_order_id,
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
  ): Promise<Map<number, PurchaseOrderApprovalListProgress>> {
    const map = new Map<number, PurchaseOrderApprovalListProgress>();
    if (!ids.length) return map;
    const unique = [...new Set(ids.filter((id) => Number.isFinite(id)))];
    if (!unique.length) return map;
    try {
      type Raw = {
        purchase_order_id: number;
        total: number | string;
        seq: number | string | null;
        role: string | null;
        rej_seq: number | string | null;
        steps: unknown;
      };
      const rows: Raw[] = await dataSource.query(
        `WITH step_rows AS (
          SELECT purchase_order_id, sequence_order, step_role, status
          FROM purchase_order_approval_step
          WHERE purchase_order_id = ANY($1::int[])
        ),
        totals AS (
          SELECT purchase_order_id, COUNT(*)::int AS total
          FROM step_rows
          GROUP BY purchase_order_id
        ),
        pending AS (
          SELECT DISTINCT ON (purchase_order_id)
            purchase_order_id,
            sequence_order AS seq,
            step_role AS role
          FROM step_rows
          WHERE status = '${PurchaseRequestApprovalStepStatus.PENDING}'
          ORDER BY purchase_order_id, sequence_order ASC
        ),
        rejected AS (
          SELECT DISTINCT ON (purchase_order_id)
            purchase_order_id,
            sequence_order AS rej_seq
          FROM step_rows
          WHERE status = '${PurchaseRequestApprovalStepStatus.REJECTED}'
          ORDER BY purchase_order_id, sequence_order ASC
        ),
        agg AS (
          SELECT purchase_order_id,
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
          GROUP BY purchase_order_id
        )
        SELECT t.purchase_order_id, t.total, p.seq, p.role, r.rej_seq, a.steps
        FROM totals t
        LEFT JOIN pending p ON p.purchase_order_id = t.purchase_order_id
        LEFT JOIN rejected r ON r.purchase_order_id = t.purchase_order_id
        LEFT JOIN agg a ON a.purchase_order_id = t.purchase_order_id`,
        [unique],
      );
      for (const row of rows) {
        const steps = this.parseApprovalListStepsJson(row.steps);
        map.set(Number(row.purchase_order_id), {
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

  private parseApprovalListStepsJson(raw: unknown): PurchaseOrderApprovalListStep[] {
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
    const out: PurchaseOrderApprovalListStep[] = [];
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

  private async attachApprovalProgressToRows<T extends PurchaseOrder>(
    rows: T[],
  ): Promise<Array<T & { approval_progress: PurchaseOrderApprovalListProgress | null }>> {
    const progressMap = await this.loadApprovalProgressMap(
      rows.map((r) => r.id),
    );
    return rows.map((row) => ({
      ...(row as unknown as PurchaseOrder),
      approval_progress: progressMap.get(row.id) ?? null,
    })) as Array<
      T & { approval_progress: PurchaseOrderApprovalListProgress | null }
    >;
  }

  async create(
    createDto: CreatePurchaseOrderDto,
    userEmailId: string | null,
  ): Promise<PurchaseOrder> {
    return dataSource.transaction(async (manager) => {
      const purchaseOrderRepository = manager.getRepository(PurchaseOrder);
      const purchaseOrderItemRepository =
        manager.getRepository(PurchaseOrderItem);

      let purchaseOrderNumber = createDto.po_number?.trim() || null;
      if (purchaseOrderNumber) {
        const existingByNumber = await purchaseOrderRepository
          .createQueryBuilder('purchaseOrder')
          .where(
            'LOWER(purchaseOrder.po_number) = LOWER(:purchaseOrderNumber)',
            { purchaseOrderNumber },
          )
          .getOne();
        if (existingByNumber) {
          throw new ConflictException(
            `PO number "${purchaseOrderNumber}" already exists`,
          );
        }
      } else {
        purchaseOrderNumber =
          await this.generatePurchaseOrderNumber(manager);
      }

      const itemsWithComputedAmount = createDto.items.map((item) => ({
        ...item,
        amount: this.computeItemAmount(item),
      }));
      const computedNetAmount =
        createDto.net_amount ?? this.sumItemsAmount(itemsWithComputedAmount);
      const computedTotalBase =
        createDto.total_base_amount ??
        itemsWithComputedAmount.reduce(
          (s, item) => s + Number(item.amount ?? 0),
          0,
        );

      const statusUpper = this.normalizePrStatus(
        createDto.status ?? PrStatus.SUBMITTED,
      );
      if (
        statusUpper !== PrStatus.DRAFT &&
        statusUpper !== PrStatus.SUBMITTED
      ) {
        throw new BadRequestException(
          'Purchase order status must be DRAFT or SUBMITTED when creating.',
        );
      }

      const purchaseOrderHeader = purchaseOrderRepository.create({
        po_number: purchaseOrderNumber,
        entity_id: createDto.entity_id ?? null,
        vendor_id: createDto.vendor_id ?? null,
        vendor_site_id: createDto.vendor_site_id ?? null,
        shipping_vendor_site_id: createDto.shipping_vendor_site_id ?? null,
        billing_vendor_site_id: createDto.billing_vendor_site_id ?? null,
        shipping_address: createDto.shipping_address ?? null,
        billing_address: createDto.billing_address ?? null,
        currency_id: createDto.currency_id ?? null,
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
        terms_condition_id: createDto.terms_condition_id ?? null,
        center_id: createDto.center_id ?? null,
        remarks: createDto.remarks ?? null,
        overall_summary: createDto.overall_summary ?? null,
        total_base_amount: this.toMoney(computedTotalBase),
        oracle_invoice_group: createDto.oracle_invoice_group ?? null,
        oracle_invoice_source: createDto.oracle_invoice_source ?? null,
        oracle_invoice_type: createDto.oracle_invoice_type ?? null,
        unbudgeted_expense: createDto.unbudgeted_expense ?? false,
        unbudgeted_justification: createDto.unbudgeted_justification ?? null,
        advance_po: createDto.advance_po ?? false,
        advance_percentage:
          createDto.advance_percentage != null
            ? this.toMoney(createDto.advance_percentage)
            : null,
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
      const savedPurchaseOrder = await purchaseOrderRepository.save(
        purchaseOrderHeader,
      );

      const purchaseOrderItemsToSave = itemsWithComputedAmount.map((item) =>
        purchaseOrderItemRepository.create({
          purchase_order_id: savedPurchaseOrder.id,
          item_id: item.item_id ?? null,
          description: item.description ?? null,
          center_id: item.center_id ?? null,
          quantity: this.toMoney(item.quantity),
          estimated_rate: this.toMoney(item.estimated_rate),
          amount: this.toMoney(item.amount),
          gst_id: item.gst_id ?? null,
          gst_amount:
            item.gst_amount != null ? this.toMoney(item.gst_amount) : null,
          net_line_amount:
            item.net_line_amount != null
              ? this.toMoney(item.net_line_amount)
              : null,
          coa_id: item.coa_id ?? null,
          remarks: item.remarks ?? null,
          created_by: userEmailId ?? null,
          created_date: new Date(),
          updated_by: userEmailId ?? null,
          updated_date: new Date(),
        }),
      );
      await purchaseOrderItemRepository.save(purchaseOrderItemsToSave);

      if (this.submissionStatusRequiresWorkflow(statusUpper)) {
        await this.bootstrapPurchaseOrderApprovalChain(
          manager,
          savedPurchaseOrder,
          Number(computedNetAmount),
        );
      }

      const reloadedPurchaseOrder = await purchaseOrderRepository.findOne({
        where: { id: savedPurchaseOrder.id },
      });
      return reloadedPurchaseOrder as PurchaseOrder;
    });
  }

  async findAll(
    filter: GetPurchaseOrderFilterDto,
  ): Promise<PageDto<PurchaseOrder> | PurchaseOrderListResponse> {
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

    const purchaseOrderQueryBuilder = purchaseOrderRepository.createQueryBuilder(
      'purchaseOrder',
    )
      .leftJoin('purchaseOrder.vendor', 'vendor')
      .leftJoin('purchaseOrder.vendor_site', 'vendor_site')
      .leftJoin('purchaseOrder.entity', 'entity')
      .leftJoin('purchaseOrder.department', 'department')
      .leftJoin('purchaseOrder.subdepartment', 'subdepartment')
      .leftJoin('purchaseOrder.payment_term', 'payment_term')
      .leftJoin('purchaseOrder.center', 'center')
      .leftJoin('purchaseOrder.item_type', 'item_type')
      .select([
        'purchaseOrder.id',
        'purchaseOrder.po_number',
        'purchaseOrder.entity_id',
        'purchaseOrder.vendor_id',
        'purchaseOrder.vendor_site_id',
        'purchaseOrder.item_type_id',
        'purchaseOrder.department_id',
        'purchaseOrder.subdepartment_id',
        'purchaseOrder.payment_term_id',
        'purchaseOrder.center_id',
        'purchaseOrder.validity_from',
        'purchaseOrder.validity_to',
        'purchaseOrder.required_date',
        'purchaseOrder.frequency',
        'purchaseOrder.net_amount',
        'purchaseOrder.status',
        'purchaseOrder.created_by',
        'purchaseOrder.created_date',
        'purchaseOrder.updated_by',
        'purchaseOrder.updated_date',
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
      purchaseOrderQueryBuilder.andWhere(
        '(LOWER(purchaseOrder.po_number) LIKE LOWER(:search) OR LOWER(vendor.name) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    if (status) {
      const u = String(status).toUpperCase();
      if (u === PrStatus.SUBMITTED || u === PrStatus.PENDING) {
        purchaseOrderQueryBuilder.andWhere(
          'purchaseOrder.status IN (:...pendingStatuses)',
          {
            pendingStatuses: [PrStatus.SUBMITTED, PrStatus.PENDING],
          },
        );
      } else {
        purchaseOrderQueryBuilder.andWhere(
          'purchaseOrder.status = :status',
          { status },
        );
      }
    }
    if (vendor_id) {
      purchaseOrderQueryBuilder.andWhere(
        'purchaseOrder.vendor_id = :vendorId',
        { vendorId: vendor_id },
      );
    }
    if (entity_id) {
      purchaseOrderQueryBuilder.andWhere(
        'purchaseOrder.entity_id = :entityId',
        { entityId: entity_id },
      );
    }
    if (department_id) {
      purchaseOrderQueryBuilder.andWhere(
        'purchaseOrder.department_id = :departmentId',
        { departmentId: department_id },
      );
    }
    if (center_id) {
      purchaseOrderQueryBuilder.andWhere(
        'purchaseOrder.center_id = :centerId',
        { centerId: center_id },
      );
    }
    if (from_date) {
      purchaseOrderQueryBuilder.andWhere(
        'purchaseOrder.created_date >= :fromDate',
        { fromDate: new Date(from_date) },
      );
    }
    if (to_date) {
      purchaseOrderQueryBuilder.andWhere(
        'purchaseOrder.created_date <= :toDate',
        { toDate: new Date(to_date) },
      );
    }

    const sortColumn = orderBy ?? 'created_date';
    purchaseOrderQueryBuilder.orderBy(
      `purchaseOrder.${sortColumn}`,
      order,
    );

    if (String(filter.noLimit) === 'true') {
      const [rows, count] =
        await purchaseOrderQueryBuilder.getManyAndCount();
      const enriched = await this.attachApprovalProgressToRows(rows);
      return { rows: enriched, count };
    }

    purchaseOrderQueryBuilder.skip(filter.skip).take(filter.take);
    const itemCount = await purchaseOrderQueryBuilder.getCount();
    const { entities } = await purchaseOrderQueryBuilder.getRawAndEntities();

    const pageOptionsDto: PageOptionsDto = {
      take: filter.take,
      createdDate: new Date(),
      order: filter.order,
      skip: filter.skip,
    } as PageOptionsDto;
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    const enriched = await this.attachApprovalProgressToRows(entities);
    return new PageDto(
      enriched as unknown as PurchaseOrder[],
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
      await purchaseOrderRepository.createQueryBuilder('purchaseOrder')
        .select('purchaseOrder.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('purchaseOrder.status')
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

  async findOne(purchaseOrderId: number): Promise<
    PurchaseOrder & {
      items: PurchaseOrderItem[];
      documents: PurchaseOrderDocument[];
      approval_steps: PurchaseOrderApprovalStepView[];
    }
  > {
    const purchaseOrder = await purchaseOrderRepository.findOne({
      where: { id: purchaseOrderId },
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
    if (!purchaseOrder) {
      throw new NotFoundException(
        `Purchase order id=${purchaseOrderId} not found`,
      );
    }

    const [items, documents] = await Promise.all([
      purchaseOrderItemRepository.find({
        where: { purchase_order_id: purchaseOrderId },
        relations: { item: true },
        order: { id: 'ASC' },
      }),
      purchaseOrderDocumentRepository.find({
        where: { purchase_order_id: purchaseOrderId },
        order: { id: 'ASC' },
      }),
    ]);

    let approval_steps: PurchaseOrderApprovalStepView[] = [];
    try {
      approval_steps = await this.loadApprovalStepsSanitized(
        purchaseOrderId,
      );
    } catch {
      approval_steps = [];
    }

    return {
      ...(purchaseOrder as PurchaseOrder),
      items,
      documents,
      approval_steps,
    };
  }

  async findOneApprovalTrail(
    purchaseOrderId: number,
  ): Promise<PurchaseOrderApprovalTrailDto> {
    const purchaseOrder = await purchaseOrderRepository.findOne({
      where: { id: purchaseOrderId },
      select: { id: true, status: true },
    });
    if (!purchaseOrder) {
      throw new NotFoundException(
        `Purchase order id=${purchaseOrderId} not found`,
      );
    }
    let approval_steps: PurchaseOrderApprovalStepView[] = [];
    try {
      approval_steps = await this.loadApprovalStepsSanitized(
        purchaseOrderId,
      );
    } catch {
      approval_steps = [];
    }
    return {
      id: purchaseOrder.id,
      status: String(purchaseOrder.status ?? ''),
      approval_steps,
    };
  }

  async update(
    purchaseOrderId: number,
    updateDto: UpdatePurchaseOrderDto,
    userEmailId: string | null,
  ): Promise<PurchaseOrder> {
    return dataSource.transaction(async (manager) => {
      const purchaseOrderRepository = manager.getRepository(PurchaseOrder);
      const purchaseOrderItemRepository =
        manager.getRepository(PurchaseOrderItem);

      const purchaseOrder = await purchaseOrderRepository.findOne({
        where: { id: purchaseOrderId },
      });
      if (!purchaseOrder) {
        throw new NotFoundException(
          `Purchase order id=${purchaseOrderId} not found`,
        );
      }

      const previousStatusUpper = this.normalizePrStatus(
        purchaseOrder.status,
      );

      if (
        updateDto.po_number &&
        updateDto.po_number !== purchaseOrder.po_number
      ) {
        const existingByNumber = await purchaseOrderRepository
          .createQueryBuilder('purchaseOrder')
          .where(
            'LOWER(purchaseOrder.po_number) = LOWER(:purchaseOrderNumber)',
            { purchaseOrderNumber: updateDto.po_number },
          )
          .andWhere('purchaseOrder.id != :purchaseOrderId', {
            purchaseOrderId,
          })
          .getOne();
        if (existingByNumber) {
          throw new ConflictException(
            `PO number "${updateDto.po_number}" already exists`,
          );
        }
        purchaseOrder.po_number = updateDto.po_number;
      }

      const assignIfDefined = <K extends keyof PurchaseOrder>(
        key: K,
        value: PurchaseOrder[K] | undefined,
      ) => {
        if (value !== undefined) purchaseOrder[key] = value;
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

        const existingItems = await purchaseOrderItemRepository.find({
          where: { purchase_order_id: purchaseOrderId },
        });
        const itemsToDelete = existingItems.filter(
          (existingItem) => !incomingItemIds.includes(existingItem.id),
        );
        if (itemsToDelete.length) {
          await purchaseOrderItemRepository.delete({
            id: In(itemsToDelete.map((existingItem) => existingItem.id)),
          });
        }

        const itemsToUpsert: PurchaseOrderItem[] = [];
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
              purchaseOrderItemRepository.create({
                purchase_order_id: purchaseOrderId,
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
          await purchaseOrderItemRepository.save(itemsToUpsert);
        }

        if (updateDto.net_amount === undefined) {
          const totalAmount = itemsToUpsert.reduce(
            (accumulator, item) => accumulator + Number(item.amount ?? 0),
            0,
          );
          purchaseOrder.net_amount = this.toMoney(totalAmount);
        }
      }
      if (updateDto.net_amount !== undefined) {
        purchaseOrder.net_amount = this.toMoney(updateDto.net_amount);
      }

      purchaseOrder.updated_by =
        userEmailId ?? updateDto.updated_by ?? null;
      purchaseOrder.updated_date = new Date();

      if (updateDto.status !== undefined) {
        await this.assertDirectApproveRejectNotUsed(
          purchaseOrderId,
          String(updateDto.status),
        );
      }

      const effectiveStatusUpper = this.normalizePrStatus(
        purchaseOrder.status,
      );
      if (
        this.submissionStatusRequiresWorkflow(effectiveStatusUpper) &&
        previousStatusUpper === PrStatus.DRAFT
      ) {
        const existingSteps = await manager.count(
          PurchaseOrderApprovalStep,
          { where: { purchase_order_id: purchaseOrderId } },
        );
        if (existingSteps === 0) {
          await this.bootstrapPurchaseOrderApprovalChain(
            manager,
            purchaseOrder,
            Number(purchaseOrder.net_amount ?? 0),
          );
        }
      }

      await purchaseOrderRepository.save(purchaseOrder);
      const reloadedPurchaseOrder = await purchaseOrderRepository.findOne({
        where: { id: purchaseOrderId },
      });
      return reloadedPurchaseOrder as PurchaseOrder;
    });
  }

  async updateStatus(
    purchaseOrderId: number,
    statusDto: UpdatePurchaseOrderStatusDto,
    userEmailId: string | null,
  ): Promise<PurchaseOrder> {
    return dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(PurchaseOrder);
      const purchaseOrder = await repo.findOne({
        where: { id: purchaseOrderId },
      });
      if (!purchaseOrder) {
        throw new NotFoundException(
          `Purchase order id=${purchaseOrderId} not found`,
        );
      }

      const previousStatusUpper = this.normalizePrStatus(
        purchaseOrder.status,
      );
      const nextStatusUpper = this.normalizePrStatus(statusDto.status);

      await this.assertDirectApproveRejectNotUsed(
        purchaseOrderId,
        statusDto.status,
      );

      purchaseOrder.status = statusDto.status;
      purchaseOrder.updated_by =
        userEmailId ?? statusDto.updated_by ?? null;
      purchaseOrder.updated_date = new Date();
      await repo.save(purchaseOrder);

      if (
        this.submissionStatusRequiresWorkflow(nextStatusUpper) &&
        previousStatusUpper === PrStatus.DRAFT
      ) {
        const existingSteps = await manager.count(
          PurchaseOrderApprovalStep,
          { where: { purchase_order_id: purchaseOrderId } },
        );
        if (existingSteps === 0) {
          await this.bootstrapPurchaseOrderApprovalChain(
            manager,
            purchaseOrder,
            Number(purchaseOrder.net_amount ?? 0),
          );
        }
      }

      const reloaded = await repo.findOne({ where: { id: purchaseOrderId } });
      return reloaded as PurchaseOrder;
    });
  }

  async recordApprovalDecision(
    purchaseOrderId: number,
    actingUserId: number,
    userEmailId: string | null,
    dto: PurchaseOrderApprovalDecisionDto,
  ): Promise<
    PurchaseOrder & {
      items: PurchaseOrderItem[];
      documents: PurchaseOrderDocument[];
      approval_steps: PurchaseOrderApprovalStepView[];
    }
  > {
    await dataSource.transaction(async (manager) => {
      const prRepo = manager.getRepository(PurchaseOrder);
      const pr = await prRepo.findOne({ where: { id: purchaseOrderId } });
      if (!pr) {
        throw new NotFoundException(
          `Purchase order id=${purchaseOrderId} not found`,
        );
      }

      const prStatus = this.normalizePrStatus(pr.status);
      if (prStatus !== PrStatus.SUBMITTED) {
        throw new BadRequestException(
          'This purchase request is not awaiting approval.',
        );
      }

      const stepRepo = manager.getRepository(PurchaseOrderApprovalStep);
      const pendingStep = await stepRepo.findOne({
        where: {
          purchase_order_id: purchaseOrderId,
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
          purchase_order_id: purchaseOrderId,
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

    return this.findOne(purchaseOrderId);
  }

  async remove(purchaseOrderId: number): Promise<DeleteResult> {
    const result = await purchaseOrderRepository.delete({
      id: purchaseOrderId,
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException(
      `Purchase order id=${purchaseOrderId} not found`,
    );
  }

  async addItem(
    purchaseOrderId: number,
    createItemDto: CreatePurchaseOrderItemDto,
    userEmailId: string | null,
  ): Promise<PurchaseOrderItem> {
    await this.assertPurchaseOrderExists(purchaseOrderId);
    const computedAmount = this.computeItemAmount(createItemDto);
    const newItem = purchaseOrderItemRepository.create({
      purchase_order_id: purchaseOrderId,
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
    const savedItem = await purchaseOrderItemRepository.save(newItem);
    await this.recomputeNetAmount(purchaseOrderId);
    return savedItem;
  }

  async updateItem(
    purchaseOrderId: number,
    itemId: number,
    updateItemDto: UpdatePurchaseOrderItemDto,
    userEmailId: string | null,
  ): Promise<PurchaseOrderItem> {
    await this.assertPurchaseOrderExists(purchaseOrderId);
    const existingItem = await purchaseOrderItemRepository.findOne({
      where: { id: itemId, purchase_order_id: purchaseOrderId },
    });
    if (!existingItem) {
      throw new NotFoundException(
        `Item id=${itemId} not found on PR ${purchaseOrderId}`,
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

    const savedItem = await purchaseOrderItemRepository.save(existingItem);
    await this.recomputeNetAmount(purchaseOrderId);
    return savedItem;
  }

  async removeItem(
    purchaseOrderId: number,
    itemId: number,
  ): Promise<DeleteResult> {
    await this.assertPurchaseOrderExists(purchaseOrderId);
    const result = await purchaseOrderItemRepository.delete({
      id: itemId,
      purchase_order_id: purchaseOrderId,
    });
    if (!result?.affected) {
      throw new NotFoundException(
        `Item id=${itemId} not found on PR ${purchaseOrderId}`,
      );
    }
    await this.recomputeNetAmount(purchaseOrderId);
    return result;
  }

  private async recomputeNetAmount(
    purchaseOrderId: number,
  ): Promise<void> {
    const items = await purchaseOrderItemRepository.find({
      where: { purchase_order_id: purchaseOrderId },
    });
    const totalAmount = items.reduce(
      (accumulator, item) => accumulator + Number(item.amount ?? 0),
      0,
    );
    await purchaseOrderRepository.update(purchaseOrderId, {
      net_amount: this.toMoney(totalAmount),
      updated_date: new Date(),
    });
  }

  async listDocuments(
    purchaseOrderId: number,
  ): Promise<PurchaseOrderDocument[]> {
    await this.assertPurchaseOrderExists(purchaseOrderId);
    return purchaseOrderDocumentRepository.find({
      where: { purchase_order_id: purchaseOrderId },
      order: { id: 'ASC' },
    });
  }

  async addDocument(
    purchaseOrderId: number,
    createDocumentDto: CreatePurchaseOrderDocumentDto,
    userEmailId: string | null,
  ): Promise<PurchaseOrderDocument> {
    await this.assertPurchaseOrderExists(purchaseOrderId);
    const newDocument = purchaseOrderDocumentRepository.create({
      purchase_order_id: purchaseOrderId,
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
    return purchaseOrderDocumentRepository.save(newDocument);
  }

  async updateDocument(
    purchaseOrderId: number,
    documentId: number,
    updateDocumentDto: UpdatePurchaseOrderDocumentDto,
  ): Promise<PurchaseOrderDocument> {
    await this.assertPurchaseOrderExists(purchaseOrderId);
    const existingDocument = await purchaseOrderDocumentRepository.findOne({
      where: {
        id: documentId,
        purchase_order_id: purchaseOrderId,
      },
    });
    if (!existingDocument) {
      throw new NotFoundException(
        `Document id=${documentId} not found on PR ${purchaseOrderId}`,
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
    return purchaseOrderDocumentRepository.save(existingDocument);
  }

  async removeDocument(
    purchaseOrderId: number,
    documentId: number,
  ): Promise<DeleteResult> {
    await this.assertPurchaseOrderExists(purchaseOrderId);
    const result = await purchaseOrderDocumentRepository.delete({
      id: documentId,
      purchase_order_id: purchaseOrderId,
    });
    if (!result?.affected) {
      throw new NotFoundException(
        `Document id=${documentId} not found on PR ${purchaseOrderId}`,
      );
    }
    return result;
  }
}
