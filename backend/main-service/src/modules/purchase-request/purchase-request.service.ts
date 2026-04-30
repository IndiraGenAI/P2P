import { dataSource } from '@core/data-source';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PurchaseRequest,
  PurchaseRequestDocument,
  PurchaseRequestItem,
} from 'erp-db';
import { DeleteResult, EntityManager, In } from 'typeorm';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
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
import { PurchaseRequestRepository } from './repository/purchase-request.repository';
import { PurchaseRequestDocumentRepository } from './repository/purchase-request-document.repository';
import { PurchaseRequestItemRepository } from './repository/purchase-request-item.repository';

interface PurchaseRequestListResponse {
  rows: PurchaseRequest[];
  count: number;
}

const PURCHASE_REQUEST_NUMBER_PREFIX = 'PR-';
const PURCHASE_REQUEST_NUMBER_PAD = 4;

@Injectable()
export class PurchaseRequestService {
  // ---------- helpers ----------
  private async assertPurchaseRequestExists(
    purchaseRequestId: number,
  ): Promise<PurchaseRequest> {
    const existingPurchaseRequest = await PurchaseRequestRepository.findOne({
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
      : PurchaseRequestRepository;

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
    return `${PURCHASE_REQUEST_NUMBER_PREFIX}${String(nextNumber).padStart(
      PURCHASE_REQUEST_NUMBER_PAD,
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

  // =====================================================================
  // PURCHASE REQUEST (header + items)
  // =====================================================================
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
        status: createDto.status ?? 'DRAFT',
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

    const purchaseRequestQueryBuilder = PurchaseRequestRepository.createQueryBuilder(
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
      purchaseRequestQueryBuilder.andWhere(
        'purchaseRequest.status = :status',
        { status },
      );
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
      return { rows, count };
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
    return new PageDto(entities, pageMetaDto);
  }

  async getStatusCounts(): Promise<Record<string, number> & { ALL: number }> {
    const rows: { status: string | null; count: string }[] =
      await PurchaseRequestRepository.createQueryBuilder('purchaseRequest')
        .select('purchaseRequest.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('purchaseRequest.status')
        .getRawMany();

    const counts: Record<string, number> & { ALL: number } = {
      ALL: 0,
      DRAFT: 0,
      SUBMITTED: 0,
      APPROVED: 0,
      REJECTED: 0,
      CANCELLED: 0,
      CLOSED: 0,
    };
    for (const row of rows) {
      const key = row.status ?? 'DRAFT';
      const value = Number(row.count) || 0;
      counts[key] = (counts[key] ?? 0) + value;
      counts.ALL += value;
    }
    return counts;
  }

  async findOne(purchaseRequestId: number): Promise<
    PurchaseRequest & {
      items: PurchaseRequestItem[];
      documents: PurchaseRequestDocument[];
    }
  > {
    const purchaseRequest = await PurchaseRequestRepository.findOne({
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
      PurchaseRequestItemRepository.find({
        where: { purchase_request_id: purchaseRequestId },
        relations: { item: true },
        order: { id: 'ASC' },
      }),
      PurchaseRequestDocumentRepository.find({
        where: { purchase_request_id: purchaseRequestId },
        order: { id: 'ASC' },
      }),
    ]);
    return { ...(purchaseRequest as PurchaseRequest), items, documents };
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

      // Items: full replace if provided
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
            itemsToUpsert.push(existingItem);
          } else {
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

        // recompute net_amount unless explicitly provided
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
    const purchaseRequest =
      await this.assertPurchaseRequestExists(purchaseRequestId);
    purchaseRequest.status = statusDto.status;
    purchaseRequest.updated_by =
      userEmailId ?? statusDto.updated_by ?? null;
    purchaseRequest.updated_date = new Date();
    return PurchaseRequestRepository.save(purchaseRequest);
  }

  async remove(purchaseRequestId: number): Promise<DeleteResult> {
    const result = await PurchaseRequestRepository.delete({
      id: purchaseRequestId,
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException(
      `Purchase request id=${purchaseRequestId} not found`,
    );
  }

  // =====================================================================
  // ITEMS (single-item endpoints)
  // =====================================================================
  async addItem(
    purchaseRequestId: number,
    createItemDto: CreatePurchaseRequestItemDto,
    userEmailId: string | null,
  ): Promise<PurchaseRequestItem> {
    await this.assertPurchaseRequestExists(purchaseRequestId);
    const computedAmount = this.computeItemAmount(createItemDto);
    const newItem = PurchaseRequestItemRepository.create({
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
    const savedItem = await PurchaseRequestItemRepository.save(newItem);
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
    const existingItem = await PurchaseRequestItemRepository.findOne({
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

    const savedItem = await PurchaseRequestItemRepository.save(existingItem);
    await this.recomputeNetAmount(purchaseRequestId);
    return savedItem;
  }

  async removeItem(
    purchaseRequestId: number,
    itemId: number,
  ): Promise<DeleteResult> {
    await this.assertPurchaseRequestExists(purchaseRequestId);
    const result = await PurchaseRequestItemRepository.delete({
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
    const items = await PurchaseRequestItemRepository.find({
      where: { purchase_request_id: purchaseRequestId },
    });
    const totalAmount = items.reduce(
      (accumulator, item) => accumulator + Number(item.amount ?? 0),
      0,
    );
    await PurchaseRequestRepository.update(purchaseRequestId, {
      net_amount: this.toMoney(totalAmount),
      updated_date: new Date(),
    });
  }

  // =====================================================================
  // DOCUMENTS
  // =====================================================================
  async listDocuments(
    purchaseRequestId: number,
  ): Promise<PurchaseRequestDocument[]> {
    await this.assertPurchaseRequestExists(purchaseRequestId);
    return PurchaseRequestDocumentRepository.find({
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
    const newDocument = PurchaseRequestDocumentRepository.create({
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
    return PurchaseRequestDocumentRepository.save(newDocument);
  }

  async updateDocument(
    purchaseRequestId: number,
    documentId: number,
    updateDocumentDto: UpdatePurchaseRequestDocumentDto,
  ): Promise<PurchaseRequestDocument> {
    await this.assertPurchaseRequestExists(purchaseRequestId);
    const existingDocument = await PurchaseRequestDocumentRepository.findOne({
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
    return PurchaseRequestDocumentRepository.save(existingDocument);
  }

  async removeDocument(
    purchaseRequestId: number,
    documentId: number,
  ): Promise<DeleteResult> {
    await this.assertPurchaseRequestExists(purchaseRequestId);
    const result = await PurchaseRequestDocumentRepository.delete({
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
