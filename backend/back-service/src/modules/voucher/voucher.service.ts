import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Voucher } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { GetVoucherFilterDto } from './dto/voucher-filter.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { UpdateVoucherStatusDto } from './dto/update-status.dto';
import { voucherRepository } from './repository/voucher.repository';

interface VoucherListResponse {
  rows: Voucher[];
  count: number;
}

@Injectable()
export class VoucherService {
  async create(
    createDto: CreateVoucherDto,
    userEmailId: string | null,
  ): Promise<Voucher> {
    const code = createDto.code?.trim();
    const name = createDto.name?.trim();
    if (!code) throw new ConflictException('Code is required');
    if (!name) throw new ConflictException('Name is required');

    const codeConflict = await voucherRepository.createQueryBuilder('voucher')
      .where('LOWER(voucher.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(`Voucher code "${code}" already exists`);
    }

    const nameConflict = await voucherRepository.createQueryBuilder('voucher')
      .where('LOWER(voucher.name) = LOWER(:name)', { name })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(`Voucher name "${name}" already exists`);
    }

    const entity = voucherRepository.create({
      ...createDto,
      code,
      name,
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
    });

    return voucherRepository.save(entity);
  }

  async findAll(
    filterDto: GetVoucherFilterDto,
  ): Promise<PageDto<Voucher> | VoucherListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = voucherRepository.createQueryBuilder('voucher').select([
      'voucher.id',
      'voucher.name',
      'voucher.code',
      'voucher.status',
      'voucher.created_date',
      'voucher.updated_date',
    ]);

    if (name) {
      query.andWhere(
        '(LOWER(voucher.name) LIKE LOWER(:name) OR LOWER(voucher.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (status !== undefined && status !== null) {
      query.andWhere('voucher.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`voucher.${sortColumn}`, order);

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

  async findOne(id: number): Promise<Voucher> {
    const entity = await voucherRepository.findOne({
      where: { id },
      select: ['id', 'name', 'code', 'status'],
    });
    if (!entity) throw new NotFoundException('Voucher not found');
    return entity;
  }

  async update(
    id: number,
    updateDto: UpdateVoucherDto,
    userEmailId: string | null,
  ): Promise<Voucher> {
    const entity = await voucherRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Voucher not found');

    const nextCode = updateDto.code?.trim() ?? entity.code;
    const nextName = updateDto.name?.trim() ?? entity.name;

    if (nextCode !== entity.code) {
      const codeConflict = await voucherRepository.createQueryBuilder('voucher')
        .where('LOWER(voucher.code) = LOWER(:code)', { code: nextCode })
        .andWhere('voucher.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `Voucher code "${nextCode}" already exists`,
        );
      }
    }

    if (nextName !== entity.name) {
      const nameConflict = await voucherRepository.createQueryBuilder('voucher')
        .where('LOWER(voucher.name) = LOWER(:name)', { name: nextName })
        .andWhere('voucher.id != :id', { id })
        .getOne();
      if (nameConflict) {
        throw new ConflictException(
          `Voucher name "${nextName}" already exists`,
        );
      }
    }

    if (updateDto.code !== undefined) entity.code = nextCode;
    if (updateDto.name !== undefined) entity.name = nextName;
    if (updateDto.status !== undefined) entity.status = updateDto.status;

    entity.updated_by = userEmailId ?? updateDto.updated_by ?? null;

    return voucherRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await voucherRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Voucher not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateVoucherStatusDto,
  ): Promise<UpdateResult> {
    const result = await voucherRepository.update(id, {
      ...updateStatusDto,
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Voucher not found');
  }
}
