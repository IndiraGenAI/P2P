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
  Grn,
  GrnInvoice,
  GrnInvoiceApprovalAssignee,
  GrnInvoiceApprovalStep,
  GrnInvoiceDocument,
  GrnInvoiceItem,
  Users,
} from 'erp-db';
import { DeleteResult, EntityManager, In, IsNull } from 'typeorm';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { GRN_INVOICE_CONSTANTS } from 'src/commons/constant';
import {
  PurchaseRequestApprovalDecision,
  PurchaseRequestApprovalStepStatus,
  RcStatus,
} from 'src/commons/enum';
import {
  GrnInvoiceApprovalActorView,
  GrnInvoiceApprovalListProgress,
  GrnInvoiceApprovalListStep,
  GrnInvoiceApprovalStepView,
  GrnInvoiceApprovalTrailDto,
} from './dto/grn-invoice-approval-view.dto';
import { GrnInvoiceApprovalDecisionDto } from './dto/grn-invoice-approval-decision.dto';
import { CreateGrnInvoiceDto } from './dto/create-grn-invoice.dto';
import {
  CreateGrnInvoiceDocumentDto,
  UpdateGrnInvoiceDocumentDto,
} from './dto/grn-invoice-document.dto';
import { GetGrnInvoiceFilterDto } from './dto/get-grn-invoice-filter.dto';
import { CreateGrnInvoiceItemDto } from './dto/grn-invoice-item.dto';
import { UpdateGrnInvoiceDto } from './dto/update-grn-invoice.dto';
import { UpdateGrnInvoiceStatusDto } from './dto/update-grn-invoice-status.dto';
import { grnInvoiceRepository } from './repository/grn-invoice.repository';
import { grnInvoiceDocumentRepository } from './repository/grn-invoice-document.repository';
import { grnInvoiceItemRepository } from './repository/grn-invoice-item.repository';

@Injectable()
export class GrnInvoiceService {
  private async assertGrnInvoiceExists(id: number): Promise<GrnInvoice> {
    const row = await grnInvoiceRepository.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException(`GRN invoice id=${id} not found`);
    }
    return row;
  }

  private async generateGrnInvoiceNumber(manager?: EntityManager): Promise<string> {
    const repository = manager
      ? manager.getRepository(GrnInvoice)
      : grnInvoiceRepository;

    const lastRecord = await repository
      .createQueryBuilder('g')
      .select('g.grn_invoice_number', 'grn_invoice_number')
      .where("g.grn_invoice_number ~ '^INV-[0-9]+$'")
      .orderBy('CAST(SUBSTRING(g.grn_invoice_number FROM 5) AS INTEGER)', 'DESC')
      .limit(1)
      .getRawOne<{ grn_invoice_number: string }>();

    let nextNumber = 1;
    if (lastRecord?.grn_invoice_number) {
      const n = parseInt(lastRecord.grn_invoice_number.replace(/\D/g, ''), 10);
      if (!Number.isNaN(n)) nextNumber = n + 1;
    }
    return `${GRN_INVOICE_CONSTANTS.NUMBER_PREFIX}${String(nextNumber).padStart(
      GRN_INVOICE_CONSTANTS.NUMBER_PAD,
      '0',
    )}`;
  }

  private toMoney(value: number | undefined | null): string {
    return Number(value ?? 0).toFixed(2);
  }

  private computeBaseAmount(item: {
    quantity?: number | null;
    rate?: number | null;
    base_amount?: number | null;
  }): number {
    if (item.base_amount !== undefined && item.base_amount !== null) {
      return Number(item.base_amount);
    }
    const qty = Number(item.quantity ?? 1);
    const rate = Number(item.rate ?? 0);
    return qty * rate;
  }

  private sumLineBases(
    items: { base_amount?: number | string | null }[],
  ): number {
    return items.reduce((acc, row) => acc + Number(row.base_amount ?? 0), 0);
  }

  private assertValidRcLine(
    label: string,
    item_id: number | string | null | undefined,
    center_id: number | string | null | undefined,
    rate: unknown,
    remarks: unknown,
  ): void {
    const iid = item_id != null ? Number(item_id) : NaN;
    if (!Number.isInteger(iid) || iid < 1) {
      throw new BadRequestException(`${label}: Item is required.`);
    }
    const cid = center_id != null ? Number(center_id) : NaN;
    if (!Number.isInteger(cid) || cid < 1) {
      throw new BadRequestException(`${label}: Center is required.`);
    }
    const r = Number(rate);
    if (!Number.isFinite(r) || r < 0) {
      throw new BadRequestException(`${label}: Rate must be zero or greater.`);
    }
    const rem = String(remarks ?? '').trim();
    if (!rem) {
      throw new BadRequestException(`${label}: Remarks are required.`);
    }
  }

  private normalizeStatus(status: string | null | undefined): string {
    return String(status ?? '').toUpperCase();
  }

  private submissionStatusRequiresWorkflow(
    status: string | null | undefined,
  ): boolean {
    return this.normalizeStatus(status) === RcStatus.SUBMITTED;
  }

  private async assertDirectApproveRejectNotUsedGrn(
    grnId: number,
    nextStatus: string,
  ): Promise<void> {
    const upper = nextStatus.toUpperCase();
    if (upper !== RcStatus.APPROVED && upper !== RcStatus.REJECTED) {
      return;
    }
    const n = await dataSource.getRepository(GrnInvoiceApprovalStep).count({
      where: { grn_invoice_id: grnId },
    });
    if (n > 0) {
      throw new BadRequestException(
        'This GRN invoice uses the approval workflow. Use the approval decision endpoint to approve or reject.',
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

  private async bootstrapGrnApprovalChain(
    manager: EntityManager,
    rc: GrnInvoice,
    netAmount: number,
    centerIdForWorkflow: number | null,
  ): Promise<void> {
    const entityId = rc.entity_id;
    const subdepartmentId = rc.subdepartment_id;
    if (
      entityId === null ||
      entityId === undefined ||
      subdepartmentId === null ||
      subdepartmentId === undefined
    ) {
      throw new BadRequestException(
        'Entity and sub-department are required when submitting a GRN invoice.',
      );
    }

    const workflow = await this.loadMatchingApprovalWorkflow(manager, {
      entityId,
      subdepartmentId,
      centerId: centerIdForWorkflow,
      transactionType: ApprovalWorkflowTransactionType.GRN_INVOICE,
    });

    if (!workflow) {
      throw new BadRequestException(
        GRN_INVOICE_CONSTANTS.NO_APPROVAL_WORKFLOW_MESSAGE,
      );
    }

    const tier = this.pickApprovalTierForAmount(workflow, netAmount);
    if (!tier) {
      throw new BadRequestException(
        GRN_INVOICE_CONSTANTS.NO_APPROVAL_WORKFLOW_MESSAGE,
      );
    }

    const ordered = this.buildOrderedWorkflowSteps(tier);
    if (!ordered.length) {
      throw new BadRequestException(
        GRN_INVOICE_CONSTANTS.NO_APPROVAL_WORKFLOW_MESSAGE,
      );
    }

    const stepRepo = manager.getRepository(GrnInvoiceApprovalStep);
    const assigneeRepo = manager.getRepository(GrnInvoiceApprovalAssignee);

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
          grn_invoice_id: rc.id,
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
            grn_invoice_approval_step_id: row.id,
            user_id: u.user_id,
          }),
        );
      }
    }
  }

  private actorView(user: Users): GrnInvoiceApprovalActorView {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };
  }

  private async loadGrnInvoiceApprovalStepsSanitized(
    grnId: number,
  ): Promise<GrnInvoiceApprovalStepView[]> {
    const stepRepo = dataSource.getRepository(GrnInvoiceApprovalStep);
    const steps = await stepRepo.find({
      where: { grn_invoice_id: grnId },
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
      let actedBy: GrnInvoiceApprovalActorView | null = null;
      if (st.acted_by_user_id) {
        const actor = actorMap.get(st.acted_by_user_id);
        if (actor) actedBy = this.actorView(actor);
      }
      return {
        id: st.id,
        grn_invoice_id: st.grn_invoice_id,
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

  private async loadGrnApprovalProgressMap(
    ids: number[],
  ): Promise<Map<number, GrnInvoiceApprovalListProgress>> {
    const map = new Map<number, GrnInvoiceApprovalListProgress>();
    if (!ids.length) return map;
    const unique = [...new Set(ids.filter((id) => Number.isFinite(id)))];
    if (!unique.length) return map;
    try {
      type Raw = {
        grn_invoice_id: number;
        total: number | string;
        seq: number | string | null;
        role: string | null;
        rej_seq: number | string | null;
        steps: unknown;
      };
      const rows: Raw[] = await dataSource.query(
        `WITH step_rows AS (
          SELECT grn_invoice_id, sequence_order, step_role, status
          FROM grn_invoice_approval_step
          WHERE grn_invoice_id = ANY($1::int[])
        ),
        totals AS (
          SELECT grn_invoice_id, COUNT(*)::int AS total
          FROM step_rows
          GROUP BY grn_invoice_id
        ),
        pending AS (
          SELECT DISTINCT ON (grn_invoice_id)
            grn_invoice_id,
            sequence_order AS seq,
            step_role AS role
          FROM step_rows
          WHERE status = '${PurchaseRequestApprovalStepStatus.PENDING}'
          ORDER BY grn_invoice_id, sequence_order ASC
        ),
        rejected AS (
          SELECT DISTINCT ON (grn_invoice_id)
            grn_invoice_id,
            sequence_order AS rej_seq
          FROM step_rows
          WHERE status = '${PurchaseRequestApprovalStepStatus.REJECTED}'
          ORDER BY grn_invoice_id, sequence_order ASC
        ),
        agg AS (
          SELECT grn_invoice_id,
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
          GROUP BY grn_invoice_id
        )
        SELECT t.grn_invoice_id, t.total, p.seq, p.role, r.rej_seq, a.steps
        FROM totals t
        LEFT JOIN pending p ON p.grn_invoice_id = t.grn_invoice_id
        LEFT JOIN rejected r ON r.grn_invoice_id = t.grn_invoice_id
        LEFT JOIN agg a ON a.grn_invoice_id = t.grn_invoice_id`,
        [unique],
      );
      for (const row of rows) {
        const steps = this.parseGrnInvoiceApprovalListStepsJson(row.steps);
        map.set(Number(row.grn_invoice_id), {
          total_steps: Number(row.total),
          current_step: row.seq == null ? null : Number(row.seq),
          current_role: row.role,
          rejected_at_step: row.rej_seq == null ? null : Number(row.rej_seq),
          steps,
        });
      }
    } catch {
      /* list still works without progress */
    }
    return map;
  }

  private parseGrnInvoiceApprovalListStepsJson(
    raw: unknown,
  ): GrnInvoiceApprovalListStep[] {
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
    const out: GrnInvoiceApprovalListStep[] = [];
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

  private async attachGrnApprovalProgressToRows<T extends GrnInvoice>(
    rows: T[],
  ): Promise<
    Array<T & { approval_progress: GrnInvoiceApprovalListProgress | null }>
  > {
    const progressMap = await this.loadGrnApprovalProgressMap(
      rows.map((r) => r.id),
    );
    return rows.map((row) => ({
      ...(row as unknown as GrnInvoice),
      approval_progress: progressMap.get(row.id) ?? null,
    })) as Array<
      T & { approval_progress: GrnInvoiceApprovalListProgress | null }
    >;
  }

  async create(
    dto: CreateGrnInvoiceDto,
    userEmailId: string | null,
  ): Promise<GrnInvoice> {
    return dataSource.transaction(async (manager) => {
      const rcRepo = manager.getRepository(GrnInvoice);
      const itemRepo = manager.getRepository(GrnInvoiceItem);

      const srcGrnId = Number(dto.grn_id);
      if (!Number.isInteger(srcGrnId) || srcGrnId < 1) {
        throw new BadRequestException('Valid source GRN id is required.');
      }
      const srcGrn = await manager.getRepository(Grn).findOne({
        where: { id: srcGrnId },
        select: { id: true, status: true, rate_contract_id: true },
      });
      if (!srcGrn) {
        throw new BadRequestException('Source GRN not found.');
      }
      if (this.normalizeStatus(srcGrn.status) !== RcStatus.APPROVED) {
        throw new BadRequestException(
          'GRN invoice can only be created from an approved GRN.',
        );
      }

      let grnNumber = dto.grn_invoice_number?.trim() || null;
      if (grnNumber) {
        const exists = await rcRepo
          .createQueryBuilder('rc')
          .where('LOWER(rc.grn_invoice_number) = LOWER(:n)', { n: grnNumber })
          .getOne();
        if (exists) {
          throw new ConflictException(
            `GRN invoice number "${grnNumber}" already exists`,
          );
        }
      } else {
        grnNumber = await this.generateGrnInvoiceNumber(manager);
      }

      const lines = dto.items.map((item) => {
        this.assertValidRcLine(
          'Line item',
          item.item_id,
          item.center_id,
          item.rate,
          item.remarks,
        );
        const base = this.computeBaseAmount(item);
        return { ...item, base_amount: base };
      });

      const totalBase = dto.net_amount ?? this.sumLineBases(lines as never);

      const statusUpper = this.normalizeStatus(dto.status ?? RcStatus.SUBMITTED);
      if (statusUpper !== RcStatus.DRAFT && statusUpper !== RcStatus.SUBMITTED) {
        throw new BadRequestException(
          'GRN invoice status must be DRAFT or SUBMITTED when creating.',
        );
      }

      const shipAddr = dto.shipping_address?.trim() || null;
      const billAddr = dto.billing_address?.trim() || null;

      const header = rcRepo.create({
        grn_id: srcGrnId,
        grn_invoice_number: grnNumber,
        rate_contract_id:
          dto.rate_contract_id != null
            ? Number(dto.rate_contract_id)
            : srcGrn.rate_contract_id ?? null,
        invoice_no: dto.invoice_no?.trim() ?? null,
        invoice_date: dto.invoice_date ? new Date(dto.invoice_date) : null,
        entity_id: dto.entity_id ?? null,
        vendor_id: dto.vendor_id ?? null,
        vendor_site_id: dto.vendor_site_id ?? null,
        shipping_vendor_site_id: shipAddr ? null : dto.shipping_vendor_site_id ?? null,
        billing_vendor_site_id: billAddr ? null : dto.billing_vendor_site_id ?? null,
        shipping_address: shipAddr,
        billing_address: billAddr,
        currency_id: dto.currency_id ?? null,
        item_type_id: dto.item_type_id ?? null,
        validity_from: dto.validity_from ? new Date(dto.validity_from) : null,
        validity_to: dto.validity_to ? new Date(dto.validity_to) : null,
        required_date: dto.required_date ? new Date(dto.required_date) : null,
        frequency: dto.frequency ?? null,
        department_id: dto.department_id ?? null,
        subdepartment_id: dto.subdepartment_id ?? null,
        payment_term_id: dto.payment_term_id ?? null,
        terms_condition_id: dto.terms_condition_id ?? null,
        overall_summary: dto.overall_summary ?? null,
        total_base_amount: this.toMoney(totalBase),
        net_amount: this.toMoney(totalBase),
        status:
          statusUpper === RcStatus.DRAFT ? RcStatus.DRAFT : RcStatus.SUBMITTED,
        created_by: userEmailId ?? dto.created_by ?? null,
        created_date: new Date(),
        updated_by: userEmailId ?? dto.created_by ?? null,
        updated_date: new Date(),
      });
      const saved = await rcRepo.save(header);

      const rows = (lines as CreateGrnInvoiceItemDto[]).map((item) =>
        itemRepo.create({
          grn_invoice_id: saved.id,
          item_id: item.item_id ?? null,
          description: item.description ?? null,
          center_id: item.center_id,
          quantity: this.toMoney(item.quantity ?? 1),
          rate: this.toMoney(item.rate),
          base_amount: this.toMoney(this.computeBaseAmount(item)),
          remarks: item.remarks ?? null,
          created_by: userEmailId ?? null,
          created_date: new Date(),
          updated_by: userEmailId ?? null,
          updated_date: new Date(),
        }),
      );
      await itemRepo.save(rows);

      if (this.submissionStatusRequiresWorkflow(statusUpper)) {
        const firstCenter =
          dto.items.length > 0 && dto.items[0].center_id != null
            ? Number(dto.items[0].center_id)
            : null;
        await this.bootstrapGrnApprovalChain(
          manager,
          saved,
          totalBase,
          firstCenter,
        );
      }

      return rcRepo.findOneOrFail({
        where: { id: saved.id },
      });
    });
  }

  async findAll(
    filter: GetGrnInvoiceFilterDto,
  ): Promise<PageDto<GrnInvoice> | { rows: GrnInvoice[]; count: number }> {
    const {
      search,
      status,
      vendor_id,
      entity_id,
      department_id,
      from_date,
      to_date,
      orderBy,
      order,
    } = filter;

    const qb = grnInvoiceRepository
      .createQueryBuilder('rc')
      .leftJoinAndSelect('rc.vendor', 'vendor')
      .leftJoinAndSelect('rc.entity', 'entity')
      .leftJoinAndSelect('rc.vendor_site', 'vendor_site')
      .leftJoinAndSelect('rc.shipping_vendor_site', 'ship_site')
      .leftJoinAndSelect('rc.billing_vendor_site', 'bill_site')
      .leftJoinAndSelect('rc.currency', 'currency')
      .leftJoinAndSelect('rc.item_type', 'item_type')
      .leftJoinAndSelect('rc.department', 'department')
      .leftJoinAndSelect('rc.subdepartment', 'subdepartment')
      .leftJoinAndSelect('rc.payment_term', 'payment_term')
      .leftJoinAndSelect('rc.terms_condition', 'terms_condition');

    if (search) {
      qb.andWhere(
        '(LOWER(rc.grn_invoice_number) LIKE LOWER(:search) OR LOWER(vendor.name) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    if (status) {
      const u = String(status).toUpperCase();
      if (u === RcStatus.SUBMITTED || u === RcStatus.PENDING) {
        qb.andWhere('rc.status IN (:...pendingStatuses)', {
          pendingStatuses: [RcStatus.SUBMITTED, RcStatus.PENDING],
        });
      } else {
        qb.andWhere('rc.status = :status', { status });
      }
    }
    if (vendor_id) {
      qb.andWhere('rc.vendor_id = :vendorId', { vendorId: vendor_id });
    }
    if (entity_id) {
      qb.andWhere('rc.entity_id = :entityId', { entityId: entity_id });
    }
    if (department_id) {
      qb.andWhere('rc.department_id = :departmentId', {
        departmentId: department_id,
      });
    }
    if (from_date) {
      qb.andWhere('rc.created_date >= :fromDate', {
        fromDate: new Date(from_date),
      });
    }
    if (to_date) {
      qb.andWhere('rc.created_date <= :toDate', {
        toDate: new Date(to_date),
      });
    }

    const sortColumn = orderBy ?? 'created_date';
    qb.orderBy(`rc.${sortColumn}`, order);

    if (String(filter.noLimit) === 'true') {
      const [rows, count] = await qb.getManyAndCount();
      const enriched = await this.attachGrnApprovalProgressToRows(rows);
      return { rows: enriched, count };
    }

    const itemCount = await qb.clone().getCount();
    qb.skip(filter.skip).take(filter.take);
    const rows = await qb.getMany();

    const pageOptionsDto: PageOptionsDto = {
      take: filter.take,
      createdDate: new Date(),
      order: filter.order,
      skip: filter.skip,
    } as PageOptionsDto;
    const meta = new PageMetaDto({ itemCount, pageOptionsDto });
    const enriched = await this.attachGrnApprovalProgressToRows(rows);
    return new PageDto(enriched as unknown as GrnInvoice[], meta);
  }

  async getStatusCounts(): Promise<{
    ALL: number;
    PENDING: number;
    APPROVED: number;
    REJECTED: number;
  }> {
    const rows: { status: string | null; count: string }[] =
      await grnInvoiceRepository
        .createQueryBuilder('rc')
        .select('rc.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('rc.status')
        .getRawMany();

    let all = 0;
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    for (const row of rows) {
      const raw = (row.status ?? '').toUpperCase();
      const value = Number(row.count) || 0;
      all += value;
      if (raw === RcStatus.SUBMITTED || raw === RcStatus.PENDING) {
        pending += value;
      } else if (raw === RcStatus.APPROVED) {
        approved += value;
      } else if (raw === RcStatus.REJECTED) {
        rejected += value;
      }
    }

    return { ALL: all, PENDING: pending, APPROVED: approved, REJECTED: rejected };
  }

  async findOne(id: number): Promise<
    GrnInvoice & {
      items: (GrnInvoiceItem & {
        item?: { id: number; code: string; name: string } | null;
        center?: { id: number; code: string; name: string };
      })[];
      documents: GrnInvoiceDocument[];
      approval_steps: GrnInvoiceApprovalStepView[];
    }
  > {
    const rc = await grnInvoiceRepository.findOne({
      where: { id },
      relations: {
        vendor: true,
        entity: true,
        vendor_site: true,
        shipping_vendor_site: true,
        billing_vendor_site: true,
        currency: true,
        item_type: true,
        department: true,
        subdepartment: true,
        payment_term: true,
        terms_condition: true,
      },
    });
    if (!rc) {
      throw new NotFoundException(`GRN id=${id} not found`);
    }

    const items = await grnInvoiceItemRepository.find({
      where: { grn_invoice_id: id },
      relations: { item: true, center: true },
      order: { id: 'ASC' },
    });

    const documents = await grnInvoiceDocumentRepository.find({
      where: { grn_invoice_id: id },
      order: { id: 'ASC' },
    });

    let approval_steps: GrnInvoiceApprovalStepView[] = [];
    try {
      approval_steps = await this.loadGrnInvoiceApprovalStepsSanitized(id);
    } catch {
      approval_steps = [];
    }

    return Object.assign(rc, { items, documents, approval_steps });
  }

  async findOneApprovalTrail(id: number): Promise<GrnInvoiceApprovalTrailDto> {
    const rc = await grnInvoiceRepository.findOne({
      where: { id },
      select: { id: true, status: true },
    });
    if (!rc) {
      throw new NotFoundException(`GRN id=${id} not found`);
    }
    let approval_steps: GrnInvoiceApprovalStepView[] = [];
    try {
      approval_steps = await this.loadGrnInvoiceApprovalStepsSanitized(id);
    } catch {
      approval_steps = [];
    }
    return {
      id: rc.id,
      status: String(rc.status ?? ''),
      approval_steps,
    };
  }

  async recordApprovalDecision(
    grnId: number,
    actingUserId: number,
    userEmailId: string | null,
    dto: GrnInvoiceApprovalDecisionDto,
  ): Promise<
    GrnInvoice & {
      items: (GrnInvoiceItem & {
        item?: { id: number; code: string; name: string } | null;
        center?: { id: number; code: string; name: string };
      })[];
      documents: GrnInvoiceDocument[];
      approval_steps: GrnInvoiceApprovalStepView[];
    }
  > {
    await dataSource.transaction(async (manager) => {
      const rcRepo = manager.getRepository(GrnInvoice);
      const rc = await rcRepo.findOne({ where: { id: grnId } });
      if (!rc) {
        throw new NotFoundException(
          `GRN id=${grnId} not found`,
        );
      }

      const rcStatus = this.normalizeStatus(rc.status);
      if (rcStatus !== RcStatus.SUBMITTED) {
        throw new BadRequestException(
          'This GRN is not awaiting approval.',
        );
      }

      const stepRepo = manager.getRepository(GrnInvoiceApprovalStep);
      const pendingStep = await stepRepo.findOne({
        where: {
          grn_invoice_id: grnId,
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

        rc.status = RcStatus.REJECTED;
        rc.updated_by = userEmailId;
        rc.updated_date = now;
        await rcRepo.save(rc);
        return;
      }

      pendingStep.status = PurchaseRequestApprovalStepStatus.APPROVED;
      pendingStep.acted_by_user_id = actingUserId;
      pendingStep.acted_at = now;
      pendingStep.remarks = remarks;
      await stepRepo.save(pendingStep);

      const stillPending = await stepRepo.count({
        where: {
          grn_invoice_id: grnId,
          status: PurchaseRequestApprovalStepStatus.PENDING,
        },
      });
      if (stillPending === 0) {
        rc.status = RcStatus.APPROVED;
        rc.updated_by = userEmailId;
        rc.updated_date = now;
        await rcRepo.save(rc);
      }
    });

    return this.findOne(grnId);
  }

  async update(
    id: number,
    dto: UpdateGrnInvoiceDto,
    userEmailId: string | null,
  ): Promise<GrnInvoice> {
    return dataSource.transaction(async (manager) => {
      const rcRepo = manager.getRepository(GrnInvoice);
      const itemRepo = manager.getRepository(GrnInvoiceItem);

      const rc = await rcRepo.findOne({ where: { id } });
      if (!rc) {
        throw new NotFoundException(`GRN id=${id} not found`);
      }

      const previousStatusUpper = this.normalizeStatus(rc.status);

      if (
        dto.grn_invoice_number &&
        dto.grn_invoice_number.trim().toLowerCase() !==
          String(rc.grn_invoice_number ?? '').toLowerCase()
      ) {
        const exists = await rcRepo
          .createQueryBuilder('rc')
          .where('LOWER(rc.grn_invoice_number) = LOWER(:n)', { n: dto.grn_invoice_number.trim() })
          .andWhere('rc.id != :id', { id })
          .getOne();
        if (exists) {
          throw new ConflictException(`GRN number "${dto.grn_invoice_number}" already exists`);
        }
        rc.grn_invoice_number = dto.grn_invoice_number.trim();
      }

      if (dto.entity_id !== undefined) rc.entity_id = dto.entity_id ?? null;
      if (dto.vendor_id !== undefined) rc.vendor_id = dto.vendor_id ?? null;
      if (dto.vendor_site_id !== undefined) {
        rc.vendor_site_id = dto.vendor_site_id ?? null;
      }
      if (
        dto.shipping_address !== undefined ||
        dto.shipping_vendor_site_id !== undefined
      ) {
        const addr =
          dto.shipping_address !== undefined
            ? dto.shipping_address?.trim() || null
            : rc.shipping_address ?? null;
        const vs =
          dto.shipping_vendor_site_id !== undefined
            ? dto.shipping_vendor_site_id ?? null
            : rc.shipping_vendor_site_id ?? null;
        if (dto.shipping_address !== undefined) {
          rc.shipping_address = addr;
          rc.shipping_vendor_site_id = addr ? null : vs;
        } else {
          rc.shipping_vendor_site_id = vs;
          rc.shipping_address = vs ? null : addr;
        }
      }
      if (
        dto.billing_address !== undefined ||
        dto.billing_vendor_site_id !== undefined
      ) {
        const addr =
          dto.billing_address !== undefined
            ? dto.billing_address?.trim() || null
            : rc.billing_address ?? null;
        const vs =
          dto.billing_vendor_site_id !== undefined
            ? dto.billing_vendor_site_id ?? null
            : rc.billing_vendor_site_id ?? null;
        if (dto.billing_address !== undefined) {
          rc.billing_address = addr;
          rc.billing_vendor_site_id = addr ? null : vs;
        } else {
          rc.billing_vendor_site_id = vs;
          rc.billing_address = vs ? null : addr;
        }
      }
      if (dto.currency_id !== undefined) rc.currency_id = dto.currency_id ?? null;
      if (dto.item_type_id !== undefined) rc.item_type_id = dto.item_type_id ?? null;
      if (dto.validity_from !== undefined) {
        rc.validity_from = dto.validity_from
          ? new Date(dto.validity_from)
          : null;
      }
      if (dto.validity_to !== undefined) {
        rc.validity_to = dto.validity_to ? new Date(dto.validity_to) : null;
      }
      if (dto.required_date !== undefined) {
        rc.required_date = dto.required_date ? new Date(dto.required_date) : null;
      }
      if (dto.frequency !== undefined) rc.frequency = dto.frequency ?? null;
      if (dto.department_id !== undefined) {
        rc.department_id = dto.department_id ?? null;
      }
      if (dto.subdepartment_id !== undefined) {
        rc.subdepartment_id = dto.subdepartment_id ?? null;
      }
      if (dto.payment_term_id !== undefined) {
        rc.payment_term_id = dto.payment_term_id ?? null;
      }
      if (dto.terms_condition_id !== undefined) {
        rc.terms_condition_id = dto.terms_condition_id ?? null;
      }
      if (dto.overall_summary !== undefined) {
        rc.overall_summary = dto.overall_summary ?? null;
      }
      if (dto.status !== undefined) rc.status = dto.status ?? null;

      if (dto.items) {
        const incomingIds = dto.items
          .map((r) => r.id)
          .filter((v): v is number => typeof v === 'number');

        const existing = await itemRepo.find({ where: { grn_invoice_id: id } });
        const toDelete = existing.filter((e) => !incomingIds.includes(e.id));
        if (toDelete.length) {
          await itemRepo.delete({
            id: In(toDelete.map((r) => r.id)),
          });
        }

        const batch: GrnInvoiceItem[] = [];
        for (const row of dto.items) {
          const prev = row.id
            ? existing.find((x) => x.id === row.id)
            : undefined;
          if (row.id && !prev) {
            throw new NotFoundException(`Item id=${row.id} not found on RC`);
          }

          const itemId = row.item_id ?? prev?.item_id ?? null;
          const centerId = row.center_id ?? prev?.center_id;
          const qty =
            row.quantity !== undefined
              ? row.quantity
              : Number(prev?.quantity ?? 1);
          const rate =
            row.rate !== undefined ? row.rate : Number(prev?.rate ?? 0);
          const remarks =
            row.remarks !== undefined ? row.remarks : prev?.remarks ?? '';

          this.assertValidRcLine(
            row.id ? `Line ${row.id}` : 'New line',
            itemId,
            centerId,
            rate,
            remarks,
          );

          const base = this.computeBaseAmount({
            quantity: qty,
            rate,
            base_amount: row.base_amount,
          });

          if (row.id && prev) {
            if (row.item_id !== undefined) prev.item_id = row.item_id ?? null;
            if (row.description !== undefined) {
              prev.description = row.description ?? null;
            }
            if (row.center_id !== undefined) prev.center_id = row.center_id!;
            prev.quantity = this.toMoney(qty);
            prev.rate = this.toMoney(rate);
            prev.base_amount = this.toMoney(base);
            if (row.remarks !== undefined) prev.remarks = row.remarks ?? null;
            prev.updated_by = userEmailId ?? null;
            prev.updated_date = new Date();
            batch.push(prev);
          } else {
            batch.push(
              itemRepo.create({
                grn_invoice_id: id,
                item_id: row.item_id ?? null,
                description: row.description ?? null,
                center_id: row.center_id!,
                quantity: this.toMoney(qty),
                rate: this.toMoney(rate),
                base_amount: this.toMoney(base),
                remarks: row.remarks ?? null,
                created_by: userEmailId ?? null,
                created_date: new Date(),
                updated_by: userEmailId ?? null,
                updated_date: new Date(),
              }),
            );
          }
        }
        if (batch.length) await itemRepo.save(batch);

        if (dto.net_amount === undefined) {
          const sum = batch.reduce(
            (a, it) => a + Number(it.base_amount ?? 0),
            0,
          );
          rc.total_base_amount = this.toMoney(sum);
          rc.net_amount = this.toMoney(sum);
        }
      }

      if (dto.net_amount !== undefined) {
        rc.net_amount = this.toMoney(dto.net_amount);
      }

      if (dto.status !== undefined) {
        await this.assertDirectApproveRejectNotUsedGrn(id, dto.status);
      }

      const effectiveStatusUpper = this.normalizeStatus(rc.status);
      if (
        this.submissionStatusRequiresWorkflow(effectiveStatusUpper) &&
        previousStatusUpper === RcStatus.DRAFT
      ) {
        const existingSteps = await manager.count(GrnInvoiceApprovalStep, {
          where: { grn_invoice_id: id },
        });
        if (existingSteps === 0) {
          const itemsForCenter = await itemRepo.find({
            where: { grn_invoice_id: id },
            order: { id: 'ASC' },
            take: 1,
          });
          const centerId =
            itemsForCenter[0]?.center_id != null
              ? Number(itemsForCenter[0].center_id)
              : null;
          await this.bootstrapGrnApprovalChain(
            manager,
            rc,
            Number(rc.net_amount ?? 0),
            centerId,
          );
        }
      }

      rc.updated_by = userEmailId ?? dto.updated_by ?? null;
      rc.updated_date = new Date();

      await rcRepo.save(rc);
      return rcRepo.findOneOrFail({ where: { id } });
    });
  }

  async updateStatus(
    id: number,
    dto: UpdateGrnInvoiceStatusDto,
    userEmailId: string | null,
  ): Promise<GrnInvoice> {
    return dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(GrnInvoice);
      const rc = await repo.findOne({ where: { id } });
      if (!rc) {
        throw new NotFoundException(`GRN id=${id} not found`);
      }

      const previousStatusUpper = this.normalizeStatus(rc.status);
      const nextStatusUpper = this.normalizeStatus(dto.status);

      await this.assertDirectApproveRejectNotUsedGrn(id, dto.status);

      rc.status = dto.status;
      rc.updated_by = userEmailId ?? null;
      rc.updated_date = new Date();
      await repo.save(rc);

      if (
        this.submissionStatusRequiresWorkflow(nextStatusUpper) &&
        previousStatusUpper === RcStatus.DRAFT
      ) {
        const existingSteps = await manager.count(GrnInvoiceApprovalStep, {
          where: { grn_invoice_id: id },
        });
        if (existingSteps === 0) {
          const itemRepo = manager.getRepository(GrnInvoiceItem);
          const itemsForCenter = await itemRepo.find({
            where: { grn_invoice_id: id },
            order: { id: 'ASC' },
            take: 1,
          });
          const centerId =
            itemsForCenter[0]?.center_id != null
              ? Number(itemsForCenter[0].center_id)
              : null;
          await this.bootstrapGrnApprovalChain(
            manager,
            rc,
            Number(rc.net_amount ?? 0),
            centerId,
          );
        }
      }

      const reloaded = await repo.findOne({ where: { id } });
      return reloaded as GrnInvoice;
    });
  }

  async remove(id: number): Promise<DeleteResult> {
    await this.assertGrnInvoiceExists(id);
    return grnInvoiceRepository.delete({ id });
  }

  async listDocuments(grnId: number): Promise<GrnInvoiceDocument[]> {
    await this.assertGrnInvoiceExists(grnId);
    return grnInvoiceDocumentRepository.find({
      where: { grn_invoice_id: grnId },
      order: { id: 'ASC' },
    });
  }

  async addDocument(
    grnId: number,
    dto: CreateGrnInvoiceDocumentDto,
    userEmailId: string | null,
  ): Promise<GrnInvoiceDocument> {
    await this.assertGrnInvoiceExists(grnId);
    const doc = grnInvoiceDocumentRepository.create({
      grn_invoice_id: grnId,
      file_name: dto.file_name,
      file_path: dto.file_path,
      file_type: dto.file_type ?? null,
      file_size:
        dto.file_size === undefined || dto.file_size === null
          ? null
          : String(dto.file_size),
      uploaded_by: userEmailId ?? null,
      uploaded_date: new Date(),
    });
    return grnInvoiceDocumentRepository.save(doc);
  }

  async updateDocument(
    grnId: number,
    documentId: number,
    dto: UpdateGrnInvoiceDocumentDto,
  ): Promise<GrnInvoiceDocument> {
    await this.assertGrnInvoiceExists(grnId);
    const doc = await grnInvoiceDocumentRepository.findOne({
      where: { id: documentId, grn_invoice_id: grnId },
    });
    if (!doc) {
      throw new NotFoundException(
        `Document id=${documentId} not found on GRN ${grnId}`,
      );
    }
    if (dto.file_name !== undefined) doc.file_name = dto.file_name;
    if (dto.file_path !== undefined) doc.file_path = dto.file_path;
    if (dto.file_type !== undefined) doc.file_type = dto.file_type ?? null;
    if (dto.file_size !== undefined) {
      doc.file_size =
        dto.file_size === null ? null : String(dto.file_size);
    }
    return grnInvoiceDocumentRepository.save(doc);
  }

  async removeDocument(
    grnId: number,
    documentId: number,
  ): Promise<DeleteResult> {
    await this.assertGrnInvoiceExists(grnId);
    const result = await grnInvoiceDocumentRepository.delete({
      id: documentId,
      grn_invoice_id: grnId,
    });
    if (!result?.affected) {
      throw new NotFoundException(
        `Document id=${documentId} not found on GRN ${grnId}`,
      );
    }
    return result;
  }
}
