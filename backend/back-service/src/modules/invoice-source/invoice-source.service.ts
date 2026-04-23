import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { InvoiceSource } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateInvoiceSourceDto } from './dto/create-invoice-source.dto';
import { GetInvoiceSourceFilterDto } from './dto/invoice-source-filter.dto';
import { UpdateInvoiceSourceDto } from './dto/update-invoice-source.dto';
import { UpdateInvoiceSourceStatusDto } from './dto/update-status.dto';
import { InvoiceSourceRepository } from './invoice-source.repository';

interface InvoiceSourceListResponse {
  rows: InvoiceSource[];
  count: number;
}

@Injectable()
export class InvoiceSourceService {
  async createInvoiceSource(
    createDto: CreateInvoiceSourceDto,
    userEmailId: string | null,
  ): Promise<InvoiceSource> {
    const code = createDto.code?.trim();
    const name = createDto.name?.trim();
    if (!code) throw new ConflictException('Code is required');
    if (!name) throw new ConflictException('Name is required');

    const codeConflict = await InvoiceSourceRepository.createQueryBuilder('s')
      .where('LOWER(s.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(`Invoice source code "${code}" already exists`);
    }

    const nameConflict = await InvoiceSourceRepository.createQueryBuilder('s')
      .where('LOWER(s.name) = LOWER(:name)', { name })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(`Invoice source name "${name}" already exists`);
    }

    const entity = InvoiceSourceRepository.create({
      ...createDto,
      code,
      name,
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
      created_date: new Date(),
    });

    return InvoiceSourceRepository.save(entity);
  }

  async findAllWithFilter(
    filterDto: GetInvoiceSourceFilterDto,
  ): Promise<PageDto<InvoiceSource> | InvoiceSourceListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = InvoiceSourceRepository.createQueryBuilder('s');

    if (name) {
      query.andWhere(
        '(LOWER(s.name) LIKE LOWER(:name) OR LOWER(s.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
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

  async findOne(id: number): Promise<InvoiceSource> {
    const entity = await InvoiceSourceRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Invoice source not found');
    return entity;
  }

  async updateInvoiceSource(
    id: number,
    updateDto: UpdateInvoiceSourceDto,
    userEmailId: string | null,
  ): Promise<InvoiceSource> {
    const entity = await InvoiceSourceRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Invoice source not found');

    const nextCode = updateDto.code?.trim() ?? entity.code;
    const nextName = updateDto.name?.trim() ?? entity.name;

    if (nextCode !== entity.code) {
      const codeConflict = await InvoiceSourceRepository.createQueryBuilder('s')
        .where('LOWER(s.code) = LOWER(:code)', { code: nextCode })
        .andWhere('s.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `Invoice source code "${nextCode}" already exists`,
        );
      }
    }

    if (nextName !== entity.name) {
      const nameConflict = await InvoiceSourceRepository.createQueryBuilder('s')
        .where('LOWER(s.name) = LOWER(:name)', { name: nextName })
        .andWhere('s.id != :id', { id })
        .getOne();
      if (nameConflict) {
        throw new ConflictException(
          `Invoice source name "${nextName}" already exists`,
        );
      }
    }

    if (updateDto.code !== undefined) entity.code = nextCode;
    if (updateDto.name !== undefined) entity.name = nextName;
    if (updateDto.status !== undefined) entity.status = updateDto.status;

    entity.updated_by = userEmailId ?? updateDto.updated_by ?? null;
    entity.updated_date = new Date();

    return InvoiceSourceRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await InvoiceSourceRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Invoice source not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateInvoiceSourceStatusDto,
  ): Promise<UpdateResult> {
    const result = await InvoiceSourceRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Invoice source not found');
  }
}
