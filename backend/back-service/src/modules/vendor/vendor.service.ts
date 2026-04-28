import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import {
  Vendor,
  VendorBankDetail,
  VendorCategory,
  VendorCenter,
  VendorDocument,
  VendorEntity,
  VendorSite,
} from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { GetVendorFilterDto } from './dto/vendor-filter.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { UpdateVendorStatusDto } from './dto/update-status.dto';
import {
  CreateVendorBankDetailDto,
  UpdateVendorBankDetailDto,
  UpdateVendorBankDetailStatusDto,
} from './dto/vendor-bank-detail.dto';
import {
  CreateVendorEntityDto,
  UpdateVendorEntityDto,
  UpdateVendorEntityStatusDto,
} from './dto/vendor-entity.dto';
import {
  CreateVendorCenterDto,
  UpdateVendorCenterDto,
  UpdateVendorCenterStatusDto,
} from './dto/vendor-center.dto';
import {
  CreateVendorDocumentDto,
  UpdateVendorDocumentDto,
  UpdateVendorDocumentStatusDto,
} from './dto/vendor-document.dto';
import {
  CreateVendorCategoryDto,
  GetVendorCategoryFilterDto,
  UpdateVendorCategoryDto,
  UpdateVendorCategoryStatusDto,
} from './dto/vendor-category.dto';
import {
  CreateVendorSiteDto,
  GetVendorSiteFilterDto,
  UpdateVendorSiteDto,
  UpdateVendorSiteStatusDto,
} from './dto/vendor-site.dto';
import { VendorRepository } from './repository/vendor.repository';
import { VendorBankDetailRepository } from './repository/vendor-bank-detail.repository';
import { VendorEntityRepository } from './repository/vendor-entity.repository';
import { VendorCenterRepository } from './repository/vendor-center.repository';
import { VendorDocumentRepository } from './repository/vendor-document.repository';
import { VendorCategoryRepository } from './repository/vendor-category.repository';
import { VendorSiteRepository } from './repository/vendor-site.repository';
import { TdsRepository } from '../tds/repository/tds.repository';
import { PaymentTermRepository } from '../other/payment-term/repository/payment-term.repository';
import { ApplicantTypeRepository } from '../other/applicant-type/repository/applicant-type.repository';

interface VendorListResponse {
  rows: Vendor[];
  count: number;
}

interface VendorCategoryListResponse {
  rows: VendorCategory[];
  count: number;
}

interface VendorSiteListResponse {
  rows: VendorSite[];
  count: number;
}

const VENDOR_CODE_PREFIX = 'V';
const VENDOR_CODE_PAD = 4;

@Injectable()
export class VendorService {
  // ---------- shared helpers ----------
  private async assertVendorExists(id: number): Promise<Vendor> {
    const found = await VendorRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Vendor id=${id} not found`);
    return found;
  }

  private async assertVendorCategoryExists(id: number): Promise<void> {
    const found = await VendorCategoryRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Vendor category id=${id} not found`);
    }
  }

  private async assertTdsExists(id: number): Promise<void> {
    const found = await TdsRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`TDS id=${id} not found`);
  }

  private async assertPaymentTermExists(id: number): Promise<void> {
    const found = await PaymentTermRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Payment term id=${id} not found`);
  }

  private async assertApplicantTypeExists(id: number): Promise<void> {
    const found = await ApplicantTypeRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Applicant type id=${id} not found`);
    }
  }

  private async generateVendorCode(): Promise<string> {
    const last = await VendorRepository.createQueryBuilder('v')
      .select('v.code', 'code')
      .where("v.code ~ '^V[0-9]+$'")
      .orderBy('CAST(SUBSTRING(v.code FROM 2) AS INTEGER)', 'DESC')
      .limit(1)
      .getRawOne<{ code: string }>();

    let nextNum = 1;
    if (last?.code) {
      const numPart = parseInt(last.code.replace(/\D/g, ''), 10);
      if (!Number.isNaN(numPart)) nextNum = numPart + 1;
    }
    return `${VENDOR_CODE_PREFIX}${String(nextNum).padStart(VENDOR_CODE_PAD, '0')}`;
  }

  private trimOrNull<T extends string | null | undefined>(v: T): string | null {
    if (v === undefined || v === null) return null;
    const trimmed = String(v).trim();
    return trimmed === '' ? null : trimmed;
  }

  // =====================================================================
  // VENDOR (master)
  // =====================================================================
  async create(
    createDto: CreateVendorDto,
    userEmailId: string | null,
  ): Promise<Vendor> {
    const name = createDto.name?.trim();
    if (!name) throw new ConflictException('Name is required');
    let code = createDto.code?.trim() || null;

    if (createDto.vendor_category_id) {
      await this.assertVendorCategoryExists(createDto.vendor_category_id);
    }
    if (createDto.tds_id) await this.assertTdsExists(createDto.tds_id);
    if (createDto.payment_term_id) {
      await this.assertPaymentTermExists(createDto.payment_term_id);
    }
    if (createDto.applicant_type_id) {
      await this.assertApplicantTypeExists(createDto.applicant_type_id);
    }

    if (code) {
      const codeConflict = await VendorRepository.createQueryBuilder('v')
        .where('LOWER(v.code) = LOWER(:code)', { code })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(`Vendor code "${code}" already exists`);
      }
    } else {
      code = await this.generateVendorCode();
    }

    const entity = VendorRepository.create({
      code,
      name,
      vendor_category_id: createDto.vendor_category_id ?? null,
      tds_id: createDto.tds_id ?? null,
      payment_term_id: createDto.payment_term_id ?? null,
      applicant_type_id: createDto.applicant_type_id ?? null,
      supplier_number: this.trimOrNull(createDto.supplier_number),
      supplier_name: this.trimOrNull(createDto.supplier_name),
      resident_status: this.trimOrNull(createDto.resident_status),
      pan_number: this.trimOrNull(createDto.pan_number)?.toUpperCase() ?? null,
      gst_number: this.trimOrNull(createDto.gst_number)?.toUpperCase() ?? null,
      country_code: this.trimOrNull(createDto.country_code),
      vendor_type: this.trimOrNull(createDto.vendor_type),
      is_msme: createDto.is_msme ?? false,
      address_line1: this.trimOrNull(createDto.address_line1),
      address_line2: this.trimOrNull(createDto.address_line2),
      address_line3: this.trimOrNull(createDto.address_line3),
      state_code: this.trimOrNull(createDto.state_code),
      city: this.trimOrNull(createDto.city),
      pincode: this.trimOrNull(createDto.pincode),
      country_id: createDto.country_id ?? null,
      currency_id: createDto.currency_id ?? null,
      contact_first_name: this.trimOrNull(createDto.contact_first_name),
      contact_last_name: this.trimOrNull(createDto.contact_last_name),
      contact_phone: this.trimOrNull(createDto.contact_phone),
      contact_email: this.trimOrNull(createDto.contact_email),
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
      created_date: new Date(),
    });

    return VendorRepository.save(entity);
  }

  async findAll(
    filterDto: GetVendorFilterDto,
  ): Promise<PageDto<Vendor> | VendorListResponse> {
    const { name, status, vendor_category_id, orderBy, order } = filterDto;

    const query = VendorRepository.createQueryBuilder('v')
      .leftJoinAndSelect('v.vendor_category', 'vendor_category')
      .leftJoinAndSelect('v.tds', 'tds')
      .leftJoinAndSelect('v.payment_term', 'payment_term')
      .leftJoinAndSelect('v.applicant_type', 'applicant_type');

    if (name) {
      query.andWhere(
        '(LOWER(v.name) LIKE LOWER(:name) OR LOWER(v.code) LIKE LOWER(:name) OR LOWER(v.supplier_number) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (vendor_category_id !== undefined && vendor_category_id !== null) {
      query.andWhere('v.vendor_category_id = :vendor_category_id', {
        vendor_category_id,
      });
    }

    if (status !== undefined && status !== null) {
      query.andWhere('v.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`v.${sortColumn}`, order);

    if (String(filterDto.noLimit) === 'true') {
      const [rows, count] = await query.getManyAndCount();
      return { rows, count };
    }

    query.skip(filterDto.skip).take(filterDto.take);
    const itemCount = await query.getCount();
    const { entities } = await query.getRawAndEntities();

    const pageOptionsDto: PageOptionsDto = {
      take: filterDto.take,
      createdDate: new Date(),
      order: filterDto.order,
      skip: filterDto.skip,
    } as PageOptionsDto;
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number): Promise<Vendor> {
    const entity = await VendorRepository.findOne({
      where: { id },
      relations: ['vendor_category', 'tds', 'payment_term', 'applicant_type'],
    });
    if (!entity) throw new NotFoundException('Vendor not found');
    return entity;
  }

  async update(
    id: number,
    updateDto: UpdateVendorDto,
    userEmailId: string | null,
  ): Promise<Vendor> {
    const entity = await VendorRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Vendor not found');

    if (
      updateDto.vendor_category_id !== undefined &&
      updateDto.vendor_category_id !== null &&
      updateDto.vendor_category_id !== entity.vendor_category_id
    ) {
      await this.assertVendorCategoryExists(updateDto.vendor_category_id);
    }
    if (
      updateDto.tds_id !== undefined &&
      updateDto.tds_id !== null &&
      updateDto.tds_id !== entity.tds_id
    ) {
      await this.assertTdsExists(updateDto.tds_id);
    }
    if (
      updateDto.payment_term_id !== undefined &&
      updateDto.payment_term_id !== null &&
      updateDto.payment_term_id !== entity.payment_term_id
    ) {
      await this.assertPaymentTermExists(updateDto.payment_term_id);
    }
    if (
      updateDto.applicant_type_id !== undefined &&
      updateDto.applicant_type_id !== null &&
      updateDto.applicant_type_id !== entity.applicant_type_id
    ) {
      await this.assertApplicantTypeExists(updateDto.applicant_type_id);
    }

    const nextCode =
      updateDto.code !== undefined
        ? updateDto.code?.trim() || entity.code
        : entity.code;
    const nextName = updateDto.name?.trim() ?? entity.name;

    if (nextCode && nextCode !== entity.code) {
      const codeConflict = await VendorRepository.createQueryBuilder('v')
        .where('LOWER(v.code) = LOWER(:code)', { code: nextCode })
        .andWhere('v.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `Vendor code "${nextCode}" already exists`,
        );
      }
    }

    if (updateDto.code !== undefined) entity.code = nextCode;
    if (updateDto.name !== undefined) entity.name = nextName;
    if (updateDto.vendor_category_id !== undefined) {
      entity.vendor_category_id = updateDto.vendor_category_id ?? null;
    }
    if (updateDto.supplier_number !== undefined) {
      entity.supplier_number = this.trimOrNull(updateDto.supplier_number);
    }
    if (updateDto.supplier_name !== undefined) {
      entity.supplier_name = this.trimOrNull(updateDto.supplier_name);
    }
    if (updateDto.tds_id !== undefined) {
      entity.tds_id = updateDto.tds_id ?? null;
    }
    if (updateDto.payment_term_id !== undefined) {
      entity.payment_term_id = updateDto.payment_term_id ?? null;
    }
    if (updateDto.applicant_type_id !== undefined) {
      entity.applicant_type_id = updateDto.applicant_type_id ?? null;
    }
    if (updateDto.resident_status !== undefined) {
      entity.resident_status = this.trimOrNull(updateDto.resident_status);
    }
    if (updateDto.pan_number !== undefined) {
      entity.pan_number =
        this.trimOrNull(updateDto.pan_number)?.toUpperCase() ?? null;
    }
    if (updateDto.gst_number !== undefined) {
      entity.gst_number =
        this.trimOrNull(updateDto.gst_number)?.toUpperCase() ?? null;
    }
    if (updateDto.country_code !== undefined) {
      entity.country_code = this.trimOrNull(updateDto.country_code);
    }
    if (updateDto.vendor_type !== undefined) {
      entity.vendor_type = this.trimOrNull(updateDto.vendor_type);
    }
    if (updateDto.is_msme !== undefined) entity.is_msme = updateDto.is_msme;

    if (updateDto.address_line1 !== undefined) {
      entity.address_line1 = this.trimOrNull(updateDto.address_line1);
    }
    if (updateDto.address_line2 !== undefined) {
      entity.address_line2 = this.trimOrNull(updateDto.address_line2);
    }
    if (updateDto.address_line3 !== undefined) {
      entity.address_line3 = this.trimOrNull(updateDto.address_line3);
    }
    if (updateDto.state_code !== undefined) {
      entity.state_code = this.trimOrNull(updateDto.state_code);
    }
    if (updateDto.city !== undefined) {
      entity.city = this.trimOrNull(updateDto.city);
    }
    if (updateDto.pincode !== undefined) {
      entity.pincode = this.trimOrNull(updateDto.pincode);
    }
    if (updateDto.country_id !== undefined) {
      entity.country_id = updateDto.country_id ?? null;
    }
    if (updateDto.currency_id !== undefined) {
      entity.currency_id = updateDto.currency_id ?? null;
    }
    if (updateDto.contact_first_name !== undefined) {
      entity.contact_first_name = this.trimOrNull(updateDto.contact_first_name);
    }
    if (updateDto.contact_last_name !== undefined) {
      entity.contact_last_name = this.trimOrNull(updateDto.contact_last_name);
    }
    if (updateDto.contact_phone !== undefined) {
      entity.contact_phone = this.trimOrNull(updateDto.contact_phone);
    }
    if (updateDto.contact_email !== undefined) {
      entity.contact_email = this.trimOrNull(updateDto.contact_email);
    }

    if (updateDto.status !== undefined) entity.status = updateDto.status;

    entity.updated_by = userEmailId ?? updateDto.updated_by ?? null;
    entity.updated_date = new Date();

    return VendorRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await VendorRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateVendorStatusDto,
  ): Promise<UpdateResult> {
    const result = await VendorRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor not found');
  }

  // =====================================================================
  // VENDOR BANK DETAILS
  // =====================================================================
  async listBankDetails(vendorId: number): Promise<VendorBankDetail[]> {
    await this.assertVendorExists(vendorId);
    return VendorBankDetailRepository.find({
      where: { vendor_id: vendorId },
      order: { created_date: 'DESC' },
    });
  }

  async findBankDetail(
    vendorId: number,
    id: number,
  ): Promise<VendorBankDetail> {
    const row = await VendorBankDetailRepository.findOne({
      where: { id, vendor_id: vendorId },
    });
    if (!row) throw new NotFoundException('Vendor bank detail not found');
    return row;
  }

  async createBankDetail(
    vendorId: number,
    dto: CreateVendorBankDetailDto,
    userEmailId: string | null,
  ): Promise<VendorBankDetail> {
    await this.assertVendorExists(vendorId);
    const entity = VendorBankDetailRepository.create({
      vendor_id: vendorId,
      account_number: this.trimOrNull(dto.account_number),
      bank_name: this.trimOrNull(dto.bank_name),
      branch_name: this.trimOrNull(dto.branch_name),
      ifsc_code: this.trimOrNull(dto.ifsc_code)?.toUpperCase() ?? null,
      status: dto.status ?? true,
      created_by: userEmailId,
      created_date: new Date(),
    });
    return VendorBankDetailRepository.save(entity);
  }

  async updateBankDetail(
    vendorId: number,
    id: number,
    dto: UpdateVendorBankDetailDto,
    userEmailId: string | null,
  ): Promise<VendorBankDetail> {
    const row = await this.findBankDetail(vendorId, id);
    if (dto.account_number !== undefined) {
      row.account_number = this.trimOrNull(dto.account_number);
    }
    if (dto.bank_name !== undefined) {
      row.bank_name = this.trimOrNull(dto.bank_name);
    }
    if (dto.branch_name !== undefined) {
      row.branch_name = this.trimOrNull(dto.branch_name);
    }
    if (dto.ifsc_code !== undefined) {
      row.ifsc_code = this.trimOrNull(dto.ifsc_code)?.toUpperCase() ?? null;
    }
    if (dto.status !== undefined) row.status = dto.status;

    row.updated_by = userEmailId;
    row.updated_date = new Date();
    return VendorBankDetailRepository.save(row);
  }

  async updateBankDetailStatus(
    vendorId: number,
    id: number,
    dto: UpdateVendorBankDetailStatusDto,
    userEmailId: string | null,
  ): Promise<UpdateResult> {
    await this.findBankDetail(vendorId, id);
    const result = await VendorBankDetailRepository.update(id, {
      status: dto.status,
      updated_by: userEmailId,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor bank detail not found');
  }

  async removeBankDetail(
    vendorId: number,
    id: number,
  ): Promise<DeleteResult> {
    await this.findBankDetail(vendorId, id);
    const result = await VendorBankDetailRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor bank detail not found');
  }

  // =====================================================================
  // VENDOR ENTITY MAPPINGS
  // =====================================================================
  async listEntities(vendorId: number): Promise<VendorEntity[]> {
    await this.assertVendorExists(vendorId);
    return VendorEntityRepository.find({
      where: { vendor_id: vendorId },
      relations: ['entity'],
      order: { created_date: 'DESC' },
    });
  }

  async findEntityMapping(
    vendorId: number,
    id: number,
  ): Promise<VendorEntity> {
    const row = await VendorEntityRepository.findOne({
      where: { id, vendor_id: vendorId },
      relations: ['entity'],
    });
    if (!row) throw new NotFoundException('Vendor entity mapping not found');
    return row;
  }

  async createEntityMapping(
    vendorId: number,
    dto: CreateVendorEntityDto,
    userEmailId: string | null,
  ): Promise<VendorEntity> {
    await this.assertVendorExists(vendorId);

    const exists = await VendorEntityRepository.findOne({
      where: { vendor_id: vendorId, entity_id: dto.entity_id },
    });
    if (exists) {
      throw new ConflictException(
        'This entity is already mapped to the vendor',
      );
    }

    const entity = VendorEntityRepository.create({
      vendor_id: vendorId,
      entity_id: dto.entity_id,
      status: dto.status ?? true,
      created_by: userEmailId,
      created_date: new Date(),
    });
    return VendorEntityRepository.save(entity);
  }

  async updateEntityMapping(
    vendorId: number,
    id: number,
    dto: UpdateVendorEntityDto,
    userEmailId: string | null,
  ): Promise<VendorEntity> {
    const row = await this.findEntityMapping(vendorId, id);

    if (
      dto.entity_id !== undefined &&
      dto.entity_id !== row.entity_id
    ) {
      const conflict = await VendorEntityRepository.createQueryBuilder('ve')
        .where('ve.vendor_id = :vendor_id AND ve.entity_id = :entity_id', {
          vendor_id: vendorId,
          entity_id: dto.entity_id,
        })
        .andWhere('ve.id != :id', { id })
        .getOne();
      if (conflict) {
        throw new ConflictException(
          'This entity is already mapped to the vendor',
        );
      }
      row.entity_id = dto.entity_id;
    }

    if (dto.status !== undefined) row.status = dto.status;

    row.updated_by = userEmailId;
    row.updated_date = new Date();
    return VendorEntityRepository.save(row);
  }

  async updateEntityMappingStatus(
    vendorId: number,
    id: number,
    dto: UpdateVendorEntityStatusDto,
    userEmailId: string | null,
  ): Promise<UpdateResult> {
    await this.findEntityMapping(vendorId, id);
    const result = await VendorEntityRepository.update(id, {
      status: dto.status,
      updated_by: userEmailId,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor entity mapping not found');
  }

  async removeEntityMapping(
    vendorId: number,
    id: number,
  ): Promise<DeleteResult> {
    await this.findEntityMapping(vendorId, id);
    const result = await VendorEntityRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor entity mapping not found');
  }

  // =====================================================================
  // VENDOR CENTER MAPPINGS
  // =====================================================================
  async listCenters(vendorId: number): Promise<VendorCenter[]> {
    await this.assertVendorExists(vendorId);
    return VendorCenterRepository.find({
      where: { vendor_id: vendorId },
      relations: ['center'],
      order: { created_date: 'DESC' },
    });
  }

  async findCenterMapping(
    vendorId: number,
    id: number,
  ): Promise<VendorCenter> {
    const row = await VendorCenterRepository.findOne({
      where: { id, vendor_id: vendorId },
      relations: ['center'],
    });
    if (!row) throw new NotFoundException('Vendor center mapping not found');
    return row;
  }

  async createCenterMapping(
    vendorId: number,
    dto: CreateVendorCenterDto,
    userEmailId: string | null,
  ): Promise<VendorCenter> {
    await this.assertVendorExists(vendorId);

    const exists = await VendorCenterRepository.findOne({
      where: { vendor_id: vendorId, center_id: dto.center_id },
    });
    if (exists) {
      throw new ConflictException(
        'This center is already mapped to the vendor',
      );
    }

    const entity = VendorCenterRepository.create({
      vendor_id: vendorId,
      center_id: dto.center_id,
      status: dto.status ?? true,
      created_by: userEmailId,
      created_date: new Date(),
    });
    return VendorCenterRepository.save(entity);
  }

  async updateCenterMapping(
    vendorId: number,
    id: number,
    dto: UpdateVendorCenterDto,
    userEmailId: string | null,
  ): Promise<VendorCenter> {
    const row = await this.findCenterMapping(vendorId, id);

    if (
      dto.center_id !== undefined &&
      dto.center_id !== row.center_id
    ) {
      const conflict = await VendorCenterRepository.createQueryBuilder('vc')
        .where('vc.vendor_id = :vendor_id AND vc.center_id = :center_id', {
          vendor_id: vendorId,
          center_id: dto.center_id,
        })
        .andWhere('vc.id != :id', { id })
        .getOne();
      if (conflict) {
        throw new ConflictException(
          'This center is already mapped to the vendor',
        );
      }
      row.center_id = dto.center_id;
    }

    if (dto.status !== undefined) row.status = dto.status;

    row.updated_by = userEmailId;
    row.updated_date = new Date();
    return VendorCenterRepository.save(row);
  }

  async updateCenterMappingStatus(
    vendorId: number,
    id: number,
    dto: UpdateVendorCenterStatusDto,
    userEmailId: string | null,
  ): Promise<UpdateResult> {
    await this.findCenterMapping(vendorId, id);
    const result = await VendorCenterRepository.update(id, {
      status: dto.status,
      updated_by: userEmailId,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor center mapping not found');
  }

  async removeCenterMapping(
    vendorId: number,
    id: number,
  ): Promise<DeleteResult> {
    await this.findCenterMapping(vendorId, id);
    const result = await VendorCenterRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor center mapping not found');
  }

  // =====================================================================
  // VENDOR DOCUMENTS
  // =====================================================================
  async listDocuments(vendorId: number): Promise<VendorDocument[]> {
    await this.assertVendorExists(vendorId);
    return VendorDocumentRepository.find({
      where: { vendor_id: vendorId },
      order: { created_date: 'DESC' },
    });
  }

  async findDocument(vendorId: number, id: number): Promise<VendorDocument> {
    const row = await VendorDocumentRepository.findOne({
      where: { id, vendor_id: vendorId },
    });
    if (!row) throw new NotFoundException('Vendor document not found');
    return row;
  }

  async createDocument(
    vendorId: number,
    dto: CreateVendorDocumentDto,
    userEmailId: string | null,
  ): Promise<VendorDocument> {
    await this.assertVendorExists(vendorId);
    const entity = VendorDocumentRepository.create({
      vendor_id: vendorId,
      file_name: dto.file_name.trim(),
      file_url: dto.file_url.trim(),
      file_size: dto.file_size ?? null,
      mime_type: this.trimOrNull(dto.mime_type),
      description: this.trimOrNull(dto.description),
      status: dto.status ?? true,
      created_by: userEmailId,
      created_date: new Date(),
    });
    return VendorDocumentRepository.save(entity);
  }

  async updateDocument(
    vendorId: number,
    id: number,
    dto: UpdateVendorDocumentDto,
    userEmailId: string | null,
  ): Promise<VendorDocument> {
    const row = await this.findDocument(vendorId, id);

    if (dto.file_name !== undefined) row.file_name = dto.file_name.trim();
    if (dto.file_url !== undefined) row.file_url = dto.file_url.trim();
    if (dto.file_size !== undefined) row.file_size = dto.file_size ?? null;
    if (dto.mime_type !== undefined) {
      row.mime_type = this.trimOrNull(dto.mime_type);
    }
    if (dto.description !== undefined) {
      row.description = this.trimOrNull(dto.description);
    }
    if (dto.status !== undefined) row.status = dto.status;

    row.updated_by = userEmailId;
    row.updated_date = new Date();
    return VendorDocumentRepository.save(row);
  }

  async updateDocumentStatus(
    vendorId: number,
    id: number,
    dto: UpdateVendorDocumentStatusDto,
    userEmailId: string | null,
  ): Promise<UpdateResult> {
    await this.findDocument(vendorId, id);
    const result = await VendorDocumentRepository.update(id, {
      status: dto.status,
      updated_by: userEmailId,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor document not found');
  }

  async removeDocument(vendorId: number, id: number): Promise<DeleteResult> {
    await this.findDocument(vendorId, id);
    const result = await VendorDocumentRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor document not found');
  }

  // =====================================================================
  // VENDOR CATEGORY (master)
  // =====================================================================
  async createVendorCategory(
    createDto: CreateVendorCategoryDto,
    userEmailId: string | null,
  ): Promise<VendorCategory> {
    const code = createDto.code?.trim();
    const name = createDto.name?.trim();
    if (!code) throw new ConflictException('Code is required');
    if (!name) throw new ConflictException('Name is required');

    const codeConflict = await VendorCategoryRepository.createQueryBuilder('c')
      .where('LOWER(c.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(
        `Vendor category code "${code}" already exists`,
      );
    }

    const nameConflict = await VendorCategoryRepository.createQueryBuilder('c')
      .where('LOWER(c.name) = LOWER(:name)', { name })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(
        `Vendor category name "${name}" already exists`,
      );
    }

    const entity = VendorCategoryRepository.create({
      ...createDto,
      code,
      name,
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
      created_date: new Date(),
    });

    return VendorCategoryRepository.save(entity);
  }

  async findAllCategoriesWithFilter(
    filterDto: GetVendorCategoryFilterDto,
  ): Promise<PageDto<VendorCategory> | VendorCategoryListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = VendorCategoryRepository.createQueryBuilder('c');

    if (name) {
      query.andWhere(
        '(LOWER(c.name) LIKE LOWER(:name) OR LOWER(c.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (status !== undefined && status !== null) {
      query.andWhere('c.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`c.${sortColumn}`, order);

    if (String(filterDto.noLimit) === 'true') {
      const [rows, count] = await query.getManyAndCount();
      return { rows, count };
    }

    query.skip(filterDto.skip).take(filterDto.take);
    const itemCount = await query.getCount();
    const { entities } = await query.getRawAndEntities();

    const pageOptionsDto: PageOptionsDto = {
      take: filterDto.take,
      createdDate: new Date(),
      order: filterDto.order,
      skip: filterDto.skip,
    } as PageOptionsDto;
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOneCategory(id: number): Promise<VendorCategory> {
    const entity = await VendorCategoryRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Vendor category not found');
    return entity;
  }

  async updateVendorCategory(
    id: number,
    updateDto: UpdateVendorCategoryDto,
    userEmailId: string | null,
  ): Promise<VendorCategory> {
    const entity = await VendorCategoryRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Vendor category not found');

    const nextCode = updateDto.code?.trim() ?? entity.code;
    const nextName = updateDto.name?.trim() ?? entity.name;

    if (nextCode !== entity.code) {
      const codeConflict = await VendorCategoryRepository.createQueryBuilder(
        'c',
      )
        .where('LOWER(c.code) = LOWER(:code)', { code: nextCode })
        .andWhere('c.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `Vendor category code "${nextCode}" already exists`,
        );
      }
    }

    if (nextName !== entity.name) {
      const nameConflict = await VendorCategoryRepository.createQueryBuilder(
        'c',
      )
        .where('LOWER(c.name) = LOWER(:name)', { name: nextName })
        .andWhere('c.id != :id', { id })
        .getOne();
      if (nameConflict) {
        throw new ConflictException(
          `Vendor category name "${nextName}" already exists`,
        );
      }
    }

    if (updateDto.code !== undefined) entity.code = nextCode;
    if (updateDto.name !== undefined) entity.name = nextName;
    if (updateDto.status !== undefined) entity.status = updateDto.status;

    entity.updated_by = userEmailId ?? updateDto.updated_by ?? null;
    entity.updated_date = new Date();

    return VendorCategoryRepository.save(entity);
  }

  async removeCategory(id: number): Promise<DeleteResult> {
    const result = await VendorCategoryRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor category not found');
  }

  async updateCategoryStatus(
    id: number,
    updateStatusDto: UpdateVendorCategoryStatusDto,
  ): Promise<UpdateResult> {
    const result = await VendorCategoryRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor category not found');
  }

  // =====================================================================
  // VENDOR SITE
  // =====================================================================
  private async assertSiteCodeUnique(
    vendorId: number,
    siteCode: string,
    excludeId?: number,
  ): Promise<void> {
    const query = VendorSiteRepository.createQueryBuilder('s')
      .where('s.vendor_id = :vendor_id', { vendor_id: vendorId })
      .andWhere('LOWER(s.site_code) = LOWER(:site_code)', {
        site_code: siteCode,
      });
    if (excludeId !== undefined) {
      query.andWhere('s.id != :id', { id: excludeId });
    }
    const conflict = await query.getOne();
    if (conflict) {
      throw new ConflictException(
        `Site code "${siteCode}" already exists for this vendor`,
      );
    }
  }

  async createVendorSite(
    createDto: CreateVendorSiteDto,
    userEmailId: string | null,
  ): Promise<VendorSite> {
    const siteCode = createDto.site_code?.trim();
    if (!siteCode) throw new ConflictException('Site code is required');

    await this.assertVendorExists(createDto.vendor_id);
    await this.assertSiteCodeUnique(createDto.vendor_id, siteCode);

    const entity = VendorSiteRepository.create({
      ...createDto,
      site_code: siteCode,
      site_name: createDto.site_name?.trim() || null,
      address: createDto.address?.trim() || null,
      contact_person: createDto.contact_person?.trim() || null,
      contact_phone: createDto.contact_phone?.trim() || null,
      contact_email: createDto.contact_email?.trim() || null,
      supplier_site_name: createDto.supplier_site_name?.trim() || null,
      oracle_address_name: createDto.oracle_address_name?.trim() || null,
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
      created_date: new Date(),
    });

    return VendorSiteRepository.save(entity);
  }

  async findAllSitesWithFilter(
    filterDto: GetVendorSiteFilterDto,
  ): Promise<PageDto<VendorSite> | VendorSiteListResponse> {
    const { name, status, vendor_id, orderBy, order } = filterDto;

    const query = VendorSiteRepository.createQueryBuilder('s').leftJoinAndSelect(
      's.vendor',
      'vendor',
    );

    if (name) {
      query.andWhere(
        '(LOWER(s.site_name) LIKE LOWER(:name) OR LOWER(s.site_code) LIKE LOWER(:name) OR LOWER(s.contact_person) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (vendor_id !== undefined && vendor_id !== null) {
      query.andWhere('s.vendor_id = :vendor_id', { vendor_id });
    }

    if (status !== undefined && status !== null) {
      query.andWhere('s.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`s.${sortColumn}`, order);

    if (String(filterDto.noLimit) === 'true') {
      const [rows, count] = await query.getManyAndCount();
      return { rows, count };
    }

    query.skip(filterDto.skip).take(filterDto.take);
    const itemCount = await query.getCount();
    const { entities } = await query.getRawAndEntities();

    const pageOptionsDto: PageOptionsDto = {
      take: filterDto.take,
      createdDate: new Date(),
      order: filterDto.order,
      skip: filterDto.skip,
    } as PageOptionsDto;
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOneSite(id: number): Promise<VendorSite> {
    const entity = await VendorSiteRepository.findOne({
      where: { id },
      relations: ['vendor'],
    });
    if (!entity) throw new NotFoundException('Vendor site not found');
    return entity;
  }

  async updateVendorSite(
    id: number,
    updateDto: UpdateVendorSiteDto,
    userEmailId: string | null,
  ): Promise<VendorSite> {
    const entity = await VendorSiteRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Vendor site not found');

    if (
      updateDto.vendor_id !== undefined &&
      updateDto.vendor_id !== entity.vendor_id
    ) {
      await this.assertVendorExists(updateDto.vendor_id);
    }

    const nextVendorId = updateDto.vendor_id ?? entity.vendor_id;
    const nextSiteCode = updateDto.site_code?.trim() ?? entity.site_code;

    if (
      nextSiteCode !== entity.site_code ||
      nextVendorId !== entity.vendor_id
    ) {
      await this.assertSiteCodeUnique(nextVendorId, nextSiteCode, id);
    }

    if (updateDto.vendor_id !== undefined) entity.vendor_id = nextVendorId;
    if (updateDto.site_code !== undefined) entity.site_code = nextSiteCode;
    if (updateDto.site_name !== undefined) {
      entity.site_name = updateDto.site_name?.trim() || null;
    }
    if (updateDto.address !== undefined) {
      entity.address = updateDto.address?.trim() || null;
    }
    if (updateDto.contact_person !== undefined) {
      entity.contact_person = updateDto.contact_person?.trim() || null;
    }
    if (updateDto.contact_phone !== undefined) {
      entity.contact_phone = updateDto.contact_phone?.trim() || null;
    }
    if (updateDto.contact_email !== undefined) {
      entity.contact_email = updateDto.contact_email?.trim() || null;
    }
    if (updateDto.supplier_site_name !== undefined) {
      entity.supplier_site_name = updateDto.supplier_site_name?.trim() || null;
    }
    if (updateDto.oracle_address_name !== undefined) {
      entity.oracle_address_name = updateDto.oracle_address_name?.trim() || null;
    }
    if (updateDto.status !== undefined) entity.status = updateDto.status;

    entity.updated_by = userEmailId ?? updateDto.updated_by ?? null;
    entity.updated_date = new Date();

    return VendorSiteRepository.save(entity);
  }

  async removeSite(id: number): Promise<DeleteResult> {
    const result = await VendorSiteRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor site not found');
  }

  async updateSiteStatus(
    id: number,
    updateStatusDto: UpdateVendorSiteStatusDto,
  ): Promise<UpdateResult> {
    const result = await VendorSiteRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor site not found');
  }
}
