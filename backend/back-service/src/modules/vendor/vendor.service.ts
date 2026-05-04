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
import { vendorRepository } from './repository/vendor.repository';
import { vendorBankDetailRepository } from './repository/vendor-bank-detail.repository';
import { vendorEntityRepository } from './repository/vendor-entity.repository';
import { vendorCenterRepository } from './repository/vendor-center.repository';
import { vendorDocumentRepository } from './repository/vendor-document.repository';
import { vendorCategoryRepository } from './repository/vendor-category.repository';
import { vendorSiteRepository } from './repository/vendor-site.repository';
import { tdsRepository } from '../tds/repository/tds.repository';
import { paymentTermRepository } from '../other/payment-term/repository/payment-term.repository';
import { applicantTypeRepository } from '../other/applicant-type/repository/applicant-type.repository';
import { IBulkUploadResult } from '@commons/helper';

const VENDOR_CSV_HEADERS = [
  'Code',
  'Name',
  'Vendor Category',
  'Supplier Number',
  'Supplier Name',
  'TDS',
  'Payment Term',
  'Applicant Type',
  'Resident Status',
  'PAN Number',
  'GST Number',
  'Country Code',
  'Vendor Type',
  'Is MSME',
  'Address Line 1',
  'Address Line 2',
  'Address Line 3',
  'State Code',
  'City',
  'Pincode',
  'Contact First Name',
  'Contact Last Name',
  'Contact Phone',
  'Contact Email',
  'Status',
];

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
    const found = await vendorRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Vendor id=${id} not found`);
    return found;
  }

  private async assertVendorCategoryExists(id: number): Promise<void> {
    const found = await vendorCategoryRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Vendor category id=${id} not found`);
    }
  }

  private async assertTdsExists(id: number): Promise<void> {
    const found = await tdsRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`TDS id=${id} not found`);
  }

  private async assertPaymentTermExists(id: number): Promise<void> {
    const found = await paymentTermRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Payment term id=${id} not found`);
  }

  private async assertApplicantTypeExists(id: number): Promise<void> {
    const found = await applicantTypeRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Applicant type id=${id} not found`);
    }
  }

  private async generateVendorCode(): Promise<string> {
    const last = await vendorRepository.createQueryBuilder('vendor')
      .select('vendor.code', 'code')
      .where("vendor.code ~ '^V[0-9]+$'")
      .orderBy('CAST(SUBSTRING(vendor.code FROM 2) AS INTEGER)', 'DESC')
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
      const codeConflict = await vendorRepository.createQueryBuilder('vendor')
        .where('LOWER(vendor.code) = LOWER(:code)', { code })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(`Vendor code "${code}" already exists`);
      }
    } else {
      code = await this.generateVendorCode();
    }

    const entity = vendorRepository.create({
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
    });

    return vendorRepository.save(entity);
  }

  async findAll(
    filterDto: GetVendorFilterDto,
  ): Promise<PageDto<Vendor> | VendorListResponse> {
    const { name, status, vendor_category_id, orderBy, order } = filterDto;

    const query = vendorRepository.createQueryBuilder('vendor')
      .leftJoin('vendor.vendor_category', 'vendor_category')
      .leftJoin('vendor.tds', 'tds')
      .leftJoin('vendor.payment_term', 'payment_term')
      .leftJoin('vendor.applicant_type', 'applicant_type')
      .select([
        'vendor.id',
        'vendor.code',
        'vendor.name',
        'vendor.supplier_number',
        'vendor.supplier_name',
        'vendor.vendor_category_id',
        'vendor.tds_id',
        'vendor.payment_term_id',
        'vendor.applicant_type_id',
        'vendor.resident_status',
        'vendor.pan_number',
        'vendor.gst_number',
        'vendor.country_code',
        'vendor.vendor_type',
        'vendor.is_msme',
        'vendor.address_line1',
        'vendor.address_line2',
        'vendor.address_line3',
        'vendor.state_code',
        'vendor.city',
        'vendor.pincode',
        'vendor.country_id',
        'vendor.currency_id',
        'vendor.contact_first_name',
        'vendor.contact_last_name',
        'vendor.contact_phone',
        'vendor.contact_email',
        'vendor.status',
        'vendor.created_date',
        'vendor.updated_date',
        'vendor_category.id',
        'vendor_category.name',
        'tds.id',
        'tds.name',
        'payment_term.id',
        'payment_term.name',
        'applicant_type.id',
        'applicant_type.name',
      ]);

    if (name) {
      query.andWhere(
        '(LOWER(vendor.name) LIKE LOWER(:name) OR LOWER(vendor.code) LIKE LOWER(:name) OR LOWER(vendor.supplier_number) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (vendor_category_id !== undefined && vendor_category_id !== null) {
      query.andWhere('vendor.vendor_category_id = :vendor_category_id', {
        vendor_category_id,
      });
    }

    if (status !== undefined && status !== null) {
      query.andWhere('vendor.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`vendor.${sortColumn}`, order);

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
    const entity = await vendorRepository.findOne({
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
    const entity = await vendorRepository.findOne({ where: { id } });
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
      const codeConflict = await vendorRepository.createQueryBuilder('vendor')
        .where('LOWER(vendor.code) = LOWER(:code)', { code: nextCode })
        .andWhere('vendor.id != :id', { id })
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

    return vendorRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await vendorRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateVendorStatusDto,
  ): Promise<UpdateResult> {
    const result = await vendorRepository.update(id, {
      ...updateStatusDto,
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor not found');
  }

  // =====================================================================
  // VENDOR BANK DETAILS
  // =====================================================================
  async listBankDetails(vendorId: number): Promise<VendorBankDetail[]> {
    await this.assertVendorExists(vendorId);
    return vendorBankDetailRepository.find({
      where: { vendor_id: vendorId },
      order: { created_date: 'DESC' },
    });
  }

  async findBankDetail(
    vendorId: number,
    id: number,
  ): Promise<VendorBankDetail> {
    const row = await vendorBankDetailRepository.findOne({
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
    const entity = vendorBankDetailRepository.create({
      vendor_id: vendorId,
      account_number: this.trimOrNull(dto.account_number),
      bank_name: this.trimOrNull(dto.bank_name),
      branch_name: this.trimOrNull(dto.branch_name),
      ifsc_code: this.trimOrNull(dto.ifsc_code)?.toUpperCase() ?? null,
      status: dto.status ?? true,
      created_by: userEmailId,
    });
    return vendorBankDetailRepository.save(entity);
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
    return vendorBankDetailRepository.save(row);
  }

  async updateBankDetailStatus(
    vendorId: number,
    id: number,
    dto: UpdateVendorBankDetailStatusDto,
    userEmailId: string | null,
  ): Promise<UpdateResult> {
    await this.findBankDetail(vendorId, id);
    const result = await vendorBankDetailRepository.update(id, {
      status: dto.status,
      updated_by: userEmailId,
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor bank detail not found');
  }

  async removeBankDetail(
    vendorId: number,
    id: number,
  ): Promise<DeleteResult> {
    await this.findBankDetail(vendorId, id);
    const result = await vendorBankDetailRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor bank detail not found');
  }

  // =====================================================================
  // VENDOR ENTITY MAPPINGS
  // =====================================================================
  async listEntities(vendorId: number): Promise<VendorEntity[]> {
    await this.assertVendorExists(vendorId);
    return vendorEntityRepository.find({
      where: { vendor_id: vendorId },
      relations: ['entity'],
      order: { created_date: 'DESC' },
    });
  }

  async findEntityMapping(
    vendorId: number,
    id: number,
  ): Promise<VendorEntity> {
    const row = await vendorEntityRepository.findOne({
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

    const exists = await vendorEntityRepository.findOne({
      where: { vendor_id: vendorId, entity_id: dto.entity_id },
    });
    if (exists) {
      throw new ConflictException(
        'This entity is already mapped to the vendor',
      );
    }

    const entity = vendorEntityRepository.create({
      vendor_id: vendorId,
      entity_id: dto.entity_id,
      status: dto.status ?? true,
      created_by: userEmailId,
    });
    return vendorEntityRepository.save(entity);
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
      const conflict = await vendorEntityRepository.createQueryBuilder('vendor_entity')
        .where('vendor_entity.vendor_id = :vendor_id AND vendor_entity.entity_id = :entity_id', {
          vendor_id: vendorId,
          entity_id: dto.entity_id,
        })
        .andWhere('vendor_entity.id != :id', { id })
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
    return vendorEntityRepository.save(row);
  }

  async updateEntityMappingStatus(
    vendorId: number,
    id: number,
    dto: UpdateVendorEntityStatusDto,
    userEmailId: string | null,
  ): Promise<UpdateResult> {
    await this.findEntityMapping(vendorId, id);
    const result = await vendorEntityRepository.update(id, {
      status: dto.status,
      updated_by: userEmailId,
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor entity mapping not found');
  }

  async removeEntityMapping(
    vendorId: number,
    id: number,
  ): Promise<DeleteResult> {
    await this.findEntityMapping(vendorId, id);
    const result = await vendorEntityRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor entity mapping not found');
  }

  // =====================================================================
  // VENDOR CENTER MAPPINGS
  // =====================================================================
  async listCenters(vendorId: number): Promise<VendorCenter[]> {
    await this.assertVendorExists(vendorId);
    return vendorCenterRepository.find({
      where: { vendor_id: vendorId },
      relations: ['center'],
      order: { created_date: 'DESC' },
    });
  }

  async findCenterMapping(
    vendorId: number,
    id: number,
  ): Promise<VendorCenter> {
    const row = await vendorCenterRepository.findOne({
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

    const exists = await vendorCenterRepository.findOne({
      where: { vendor_id: vendorId, center_id: dto.center_id },
    });
    if (exists) {
      throw new ConflictException(
        'This center is already mapped to the vendor',
      );
    }

    const entity = vendorCenterRepository.create({
      vendor_id: vendorId,
      center_id: dto.center_id,
      status: dto.status ?? true,
      created_by: userEmailId,
    });
    return vendorCenterRepository.save(entity);
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
      const conflict = await vendorCenterRepository.createQueryBuilder('vendor_center')
        .where('vendor_center.vendor_id = :vendor_id AND vendor_center.center_id = :center_id', {
          vendor_id: vendorId,
          center_id: dto.center_id,
        })
        .andWhere('vendor_center.id != :id', { id })
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
    return vendorCenterRepository.save(row);
  }

  async updateCenterMappingStatus(
    vendorId: number,
    id: number,
    dto: UpdateVendorCenterStatusDto,
    userEmailId: string | null,
  ): Promise<UpdateResult> {
    await this.findCenterMapping(vendorId, id);
    const result = await vendorCenterRepository.update(id, {
      status: dto.status,
      updated_by: userEmailId,
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor center mapping not found');
  }

  async removeCenterMapping(
    vendorId: number,
    id: number,
  ): Promise<DeleteResult> {
    await this.findCenterMapping(vendorId, id);
    const result = await vendorCenterRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor center mapping not found');
  }

  // =====================================================================
  // VENDOR DOCUMENTS
  // =====================================================================
  async listDocuments(vendorId: number): Promise<VendorDocument[]> {
    await this.assertVendorExists(vendorId);
    return vendorDocumentRepository.find({
      where: { vendor_id: vendorId },
      order: { created_date: 'DESC' },
    });
  }

  async findDocument(vendorId: number, id: number): Promise<VendorDocument> {
    const row = await vendorDocumentRepository.findOne({
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
    const entity = vendorDocumentRepository.create({
      vendor_id: vendorId,
      file_name: dto.file_name.trim(),
      file_url: dto.file_url.trim(),
      file_size: dto.file_size ?? null,
      mime_type: this.trimOrNull(dto.mime_type),
      description: this.trimOrNull(dto.description),
      status: dto.status ?? true,
      created_by: userEmailId,
    });
    return vendorDocumentRepository.save(entity);
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
    return vendorDocumentRepository.save(row);
  }

  async updateDocumentStatus(
    vendorId: number,
    id: number,
    dto: UpdateVendorDocumentStatusDto,
    userEmailId: string | null,
  ): Promise<UpdateResult> {
    await this.findDocument(vendorId, id);
    const result = await vendorDocumentRepository.update(id, {
      status: dto.status,
      updated_by: userEmailId,
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor document not found');
  }

  async removeDocument(vendorId: number, id: number): Promise<DeleteResult> {
    await this.findDocument(vendorId, id);
    const result = await vendorDocumentRepository.delete({ id });
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

    const codeConflict = await vendorCategoryRepository.createQueryBuilder('vendor_category')
      .where('LOWER(vendor_category.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(
        `Vendor category code "${code}" already exists`,
      );
    }

    const nameConflict = await vendorCategoryRepository.createQueryBuilder('vendor_category')
      .where('LOWER(vendor_category.name) = LOWER(:name)', { name })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(
        `Vendor category name "${name}" already exists`,
      );
    }

    const entity = vendorCategoryRepository.create({
      ...createDto,
      code,
      name,
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
    });

    return vendorCategoryRepository.save(entity);
  }

  async findAllCategoriesWithFilter(
    filterDto: GetVendorCategoryFilterDto,
  ): Promise<PageDto<VendorCategory> | VendorCategoryListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = vendorCategoryRepository.createQueryBuilder('vendor_category').select([
      'vendor_category.id',
      'vendor_category.name',
      'vendor_category.code',
      'vendor_category.status',
      'vendor_category.created_date',
      'vendor_category.updated_date',
    ]);

    if (name) {
      query.andWhere(
        '(LOWER(vendor_category.name) LIKE LOWER(:name) OR LOWER(vendor_category.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (status !== undefined && status !== null) {
      query.andWhere('vendor_category.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`vendor_category.${sortColumn}`, order);

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
    const entity = await vendorCategoryRepository.findOne({
      where: { id },
      select: ['id', 'name', 'code', 'status'],
    });
    if (!entity) throw new NotFoundException('Vendor category not found');
    return entity;
  }

  async updateVendorCategory(
    id: number,
    updateDto: UpdateVendorCategoryDto,
    userEmailId: string | null,
  ): Promise<VendorCategory> {
    const entity = await vendorCategoryRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Vendor category not found');

    const nextCode = updateDto.code?.trim() ?? entity.code;
    const nextName = updateDto.name?.trim() ?? entity.name;

    if (nextCode !== entity.code) {
      const codeConflict = await vendorCategoryRepository.createQueryBuilder(
        'c',
      )
        .where('LOWER(vendor_category.code) = LOWER(:code)', { code: nextCode })
        .andWhere('vendor_category.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `Vendor category code "${nextCode}" already exists`,
        );
      }
    }

    if (nextName !== entity.name) {
      const nameConflict = await vendorCategoryRepository.createQueryBuilder(
        'c',
      )
        .where('LOWER(vendor_category.name) = LOWER(:name)', { name: nextName })
        .andWhere('vendor_category.id != :id', { id })
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

    return vendorCategoryRepository.save(entity);
  }

  async removeCategory(id: number): Promise<DeleteResult> {
    const result = await vendorCategoryRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor category not found');
  }

  async updateCategoryStatus(
    id: number,
    updateStatusDto: UpdateVendorCategoryStatusDto,
  ): Promise<UpdateResult> {
    const result = await vendorCategoryRepository.update(id, {
      ...updateStatusDto,
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
    const query = vendorSiteRepository.createQueryBuilder('vendor_site')
      .where('vendor_site.vendor_id = :vendor_id', { vendor_id: vendorId })
      .andWhere('LOWER(vendor_site.site_code) = LOWER(:site_code)', {
        site_code: siteCode,
      });
    if (excludeId !== undefined) {
      query.andWhere('vendor_site.id != :id', { id: excludeId });
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

    const entity = vendorSiteRepository.create({
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
    });

    return vendorSiteRepository.save(entity);
  }

  async findAllSitesWithFilter(
    filterDto: GetVendorSiteFilterDto,
  ): Promise<PageDto<VendorSite> | VendorSiteListResponse> {
    const { name, status, vendor_id, orderBy, order } = filterDto;

    const query = vendorSiteRepository.createQueryBuilder('vendor_site')
      .leftJoin('vendor_site.vendor', 'vendor')
      .select([
        'vendor_site.id',
        'vendor_site.site_code',
        'vendor_site.site_name',
        'vendor_site.address',
        'vendor_site.contact_person',
        'vendor_site.contact_phone',
        'vendor_site.contact_email',
        'vendor_site.supplier_site_name',
        'vendor_site.oracle_address_name',
        'vendor_site.vendor_id',
        'vendor_site.status',
        'vendor_site.created_date',
        'vendor_site.updated_date',
        'vendor.id',
        'vendor.code',
        'vendor.name',
      ]);

    if (name) {
      query.andWhere(
        '(LOWER(vendor_site.site_name) LIKE LOWER(:name) OR LOWER(vendor_site.site_code) LIKE LOWER(:name) OR LOWER(vendor_site.contact_person) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (vendor_id !== undefined && vendor_id !== null) {
      query.andWhere('vendor_site.vendor_id = :vendor_id', { vendor_id });
    }

    if (status !== undefined && status !== null) {
      query.andWhere('vendor_site.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`vendor_site.${sortColumn}`, order);

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
    const entity = await vendorSiteRepository.findOne({
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
    const entity = await vendorSiteRepository.findOne({ where: { id } });
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

    return vendorSiteRepository.save(entity);
  }

  async removeSite(id: number): Promise<DeleteResult> {
    const result = await vendorSiteRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor site not found');
  }

  async updateSiteStatus(
    id: number,
    updateStatusDto: UpdateVendorSiteStatusDto,
  ): Promise<UpdateResult> {
    const result = await vendorSiteRepository.update(id, {
      ...updateStatusDto,
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Vendor site not found');
  }

  // =====================================================================
  // VENDOR BULK UPLOAD (CSV)
  // FK columns (Vendor Category, TDS, Payment Term, Applicant Type) are
  // matched by NAME (case-insensitive), or numeric ID, for human-friendly
  // CSV authoring. Code is auto-generated when blank.
  // =====================================================================
  getCsvHeaders(): string[] {
    return [...VENDOR_CSV_HEADERS];
  }

  async bulkUploadFromCSV(
    rows: Record<string, string>[],
    userEmailId: string | null,
  ): Promise<IBulkUploadResult<Vendor>> {
    if (!rows || rows.length === 0) {
      throw new ConflictException('Uploaded CSV file is empty');
    }

    const inserted: Vendor[] = [];
    const errors: IBulkUploadResult<Vendor>['errors'] = [];

    const categories = await vendorCategoryRepository.find();
    const tdsList = await tdsRepository.find();
    const paymentTerms = await paymentTermRepository.find();
    const applicantTypes = await applicantTypeRepository.find();

    const findRefId = (
      list: { id: number; name?: string; code?: string }[],
      raw: string | undefined,
    ): number | null => {
      if (!raw) return null;
      const value = raw.trim();
      if (value === '') return null;
      if (/^\d+$/.test(value)) {
        const byId = list.find((r) => r.id === Number(value));
        if (byId) return byId.id;
      }
      const lower = value.toLowerCase();
      const match = list.find(
        (r) =>
          (r.name && r.name.toLowerCase() === lower) ||
          (r.code && r.code.toLowerCase() === lower),
      );
      return match?.id ?? null;
    };

    const parseBool = (raw: string | undefined, defaultVal: boolean): boolean => {
      if (raw === undefined || raw === null) return defaultVal;
      const v = String(raw).trim().toLowerCase();
      if (v === '') return defaultVal;
      return !['false', '0', 'no', 'inactive', 'n'].includes(v);
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2;
      try {
        const name = (row['Name'] ?? '').trim();
        if (!name) throw new Error('"Name" column is required');

        let code = (row['Code'] ?? '').trim();

        const categoryRaw = row['Vendor Category'];
        const vendorCategoryId = findRefId(categories, categoryRaw);
        if (categoryRaw && !vendorCategoryId) {
          throw new Error(`Vendor Category "${categoryRaw}" not found`);
        }

        const tdsRaw = row['TDS'];
        const tdsId = findRefId(tdsList, tdsRaw);
        if (tdsRaw && !tdsId) {
          throw new Error(`TDS "${tdsRaw}" not found`);
        }

        const paymentTermRaw = row['Payment Term'];
        const paymentTermId = findRefId(paymentTerms, paymentTermRaw);
        if (paymentTermRaw && !paymentTermId) {
          throw new Error(`Payment Term "${paymentTermRaw}" not found`);
        }

        const applicantTypeRaw = row['Applicant Type'];
        const applicantTypeId = findRefId(applicantTypes, applicantTypeRaw);
        if (applicantTypeRaw && !applicantTypeId) {
          throw new Error(`Applicant Type "${applicantTypeRaw}" not found`);
        }

        if (code) {
          const codeConflict = await vendorRepository
            .createQueryBuilder('vendor')
            .where('LOWER(vendor.code) = LOWER(:code)', { code })
            .getOne();
          if (codeConflict) {
            throw new Error(`Vendor code "${code}" already exists`);
          }
        } else {
          code = await this.generateVendorCode();
        }

        const entity = vendorRepository.create({
          code,
          name,
          vendor_category_id: vendorCategoryId,
          tds_id: tdsId,
          payment_term_id: paymentTermId,
          applicant_type_id: applicantTypeId,
          supplier_number: this.trimOrNull(row['Supplier Number']),
          supplier_name: this.trimOrNull(row['Supplier Name']),
          resident_status: this.trimOrNull(row['Resident Status']),
          pan_number:
            this.trimOrNull(row['PAN Number'])?.toUpperCase() ?? null,
          gst_number:
            this.trimOrNull(row['GST Number'])?.toUpperCase() ?? null,
          country_code: this.trimOrNull(row['Country Code']),
          vendor_type: this.trimOrNull(row['Vendor Type']),
          is_msme: parseBool(row['Is MSME'], false),
          address_line1: this.trimOrNull(row['Address Line 1']),
          address_line2: this.trimOrNull(row['Address Line 2']),
          address_line3: this.trimOrNull(row['Address Line 3']),
          state_code: this.trimOrNull(row['State Code']),
          city: this.trimOrNull(row['City']),
          pincode: this.trimOrNull(row['Pincode']),
          country_id: null,
          currency_id: null,
          contact_first_name: this.trimOrNull(row['Contact First Name']),
          contact_last_name: this.trimOrNull(row['Contact Last Name']),
          contact_phone: this.trimOrNull(row['Contact Phone']),
          contact_email: this.trimOrNull(row['Contact Email']),
          status: parseBool(row['Status'], true),
          created_by: userEmailId,
        });

        const saved = await vendorRepository.save(entity);
        inserted.push(saved);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Unknown error while saving row';
        errors.push({ row: rowNum, message, data: row });
      }
    }

    return {
      totalRows: rows.length,
      successCount: inserted.length,
      failureCount: errors.length,
      inserted,
      errors,
    };
  }
}
