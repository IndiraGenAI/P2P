import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PaymentTerm } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreatePaymentTermDto } from './dto/create-payment-term.dto';
import { GetPaymentTermFilterDto } from './dto/payment-term-filter.dto';
import { UpdatePaymentTermDto } from './dto/update-payment-term.dto';
import { UpdatePaymentTermStatusDto } from './dto/update-status.dto';
import { PaymentTermRepository } from './repository/payment-term.repository';

interface PaymentTermListResponse {
  rows: PaymentTerm[];
  count: number;
}

@Injectable()
export class PaymentTermService {
  async create(
    createDto: CreatePaymentTermDto,
    userEmailId: string | null,
  ): Promise<PaymentTerm> {
    const code = createDto.code?.trim();
    const name = createDto.name?.trim();
    if (!code) throw new ConflictException('Code is required');
    if (!name) throw new ConflictException('Name is required');

    const codeConflict = await PaymentTermRepository.createQueryBuilder('p')
      .where('LOWER(p.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(
        `Payment term code "${code}" already exists`,
      );
    }

    const nameConflict = await PaymentTermRepository.createQueryBuilder('p')
      .where('LOWER(p.name) = LOWER(:name)', { name })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(
        `Payment term name "${name}" already exists`,
      );
    }

    const entity = PaymentTermRepository.create({
      ...createDto,
      code,
      name,
      oracle_code: createDto.oracle_code?.trim() || null,
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
      created_date: new Date(),
    });

    return PaymentTermRepository.save(entity);
  }

  async findAll(
    filterDto: GetPaymentTermFilterDto,
  ): Promise<PageDto<PaymentTerm> | PaymentTermListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = PaymentTermRepository.createQueryBuilder('p');

    if (name) {
      query.andWhere(
        '(LOWER(p.name) LIKE LOWER(:name) OR LOWER(p.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (status !== undefined && status !== null) {
      query.andWhere('p.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`p.${sortColumn}`, order);

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

  async findOne(id: number): Promise<PaymentTerm> {
    const entity = await PaymentTermRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Payment term not found');
    return entity;
  }

  async update(
    id: number,
    updateDto: UpdatePaymentTermDto,
    userEmailId: string | null,
  ): Promise<PaymentTerm> {
    const entity = await PaymentTermRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Payment term not found');

    const nextCode = updateDto.code?.trim() ?? entity.code;
    const nextName = updateDto.name?.trim() ?? entity.name;

    if (nextCode !== entity.code) {
      const codeConflict = await PaymentTermRepository.createQueryBuilder('p')
        .where('LOWER(p.code) = LOWER(:code)', { code: nextCode })
        .andWhere('p.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `Payment term code "${nextCode}" already exists`,
        );
      }
    }

    if (nextName !== entity.name) {
      const nameConflict = await PaymentTermRepository.createQueryBuilder('p')
        .where('LOWER(p.name) = LOWER(:name)', { name: nextName })
        .andWhere('p.id != :id', { id })
        .getOne();
      if (nameConflict) {
        throw new ConflictException(
          `Payment term name "${nextName}" already exists`,
        );
      }
    }

    if (updateDto.code !== undefined) entity.code = nextCode;
    if (updateDto.name !== undefined) entity.name = nextName;
    if (updateDto.oracle_code !== undefined) {
      entity.oracle_code = updateDto.oracle_code?.trim() || null;
    }
    if (updateDto.status !== undefined) entity.status = updateDto.status;

    entity.updated_by = userEmailId ?? updateDto.updated_by ?? null;
    entity.updated_date = new Date();

    return PaymentTermRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await PaymentTermRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Payment term not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdatePaymentTermStatusDto,
  ): Promise<UpdateResult> {
    const result = await PaymentTermRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Payment term not found');
  }
}
