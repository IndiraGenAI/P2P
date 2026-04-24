import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { EntityMaster } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateEntityDto } from './dto/create-entity.dto';
import { GetEntityFilterDto } from './dto/entity-filter.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { UpdateEntityStatusDto } from './dto/update-status.dto';
import { EntityRepository } from './entity.repository';

interface EntityListResponse {
  rows: EntityMaster[];
  count: number;
}

const sanitizeAddresses = (
  values?: string[] | null,
): string[] | null | undefined => {
  if (values === undefined) return undefined;
  if (values === null) return null;
  const cleaned = (values ?? [])
    .map((v) => (typeof v === 'string' ? v.trim() : ''))
    .filter((v) => v.length > 0);
  return cleaned;
};

@Injectable()
export class EntityService {
  async createEntity(
    createDto: CreateEntityDto,
    userEmailId: string | null,
  ): Promise<EntityMaster> {
    const code = createDto.code?.trim();
    const name = createDto.name?.trim();
    if (!code) throw new ConflictException('Code is required');
    if (!name) throw new ConflictException('Name is required');

    const codeConflict = await EntityRepository.createQueryBuilder('e')
      .where('LOWER(e.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(`Entity code "${code}" already exists`);
    }

    const nameConflict = await EntityRepository.createQueryBuilder('e')
      .where('LOWER(e.name) = LOWER(:name)', { name })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(`Entity name "${name}" already exists`);
    }

    const entity = EntityRepository.create({
      ...createDto,
      code,
      name,
      business_unit: createDto.business_unit?.trim() ?? null,
      legal_entity: createDto.legal_entity?.trim() ?? null,
      liability_distribution:
        createDto.liability_distribution?.trim() ?? null,
      prepayment_distribution:
        createDto.prepayment_distribution?.trim() ?? null,
      shipping_addresses: sanitizeAddresses(createDto.shipping_addresses) ?? [],
      billing_addresses: sanitizeAddresses(createDto.billing_addresses) ?? [],
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
      created_date: new Date(),
    });

    return EntityRepository.save(entity);
  }

  async findAllWithFilter(
    filterDto: GetEntityFilterDto,
  ): Promise<PageDto<EntityMaster> | EntityListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = EntityRepository.createQueryBuilder('e');

    if (name) {
      query.andWhere(
        '(LOWER(e.name) LIKE LOWER(:name) OR LOWER(e.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (status !== undefined && status !== null) {
      query.andWhere('e.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`e.${sortColumn}`, order);

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

  async findOne(id: number): Promise<EntityMaster> {
    const entity = await EntityRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Entity not found');
    return entity;
  }

  async updateEntity(
    id: number,
    updateDto: UpdateEntityDto,
    userEmailId: string | null,
  ): Promise<EntityMaster> {
    const entity = await EntityRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Entity not found');

    const nextCode = updateDto.code?.trim() ?? entity.code;
    const nextName = updateDto.name?.trim() ?? entity.name;

    if (nextCode !== entity.code) {
      const codeConflict = await EntityRepository.createQueryBuilder('e')
        .where('LOWER(e.code) = LOWER(:code)', { code: nextCode })
        .andWhere('e.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `Entity code "${nextCode}" already exists`,
        );
      }
    }

    if (nextName !== entity.name) {
      const nameConflict = await EntityRepository.createQueryBuilder('e')
        .where('LOWER(e.name) = LOWER(:name)', { name: nextName })
        .andWhere('e.id != :id', { id })
        .getOne();
      if (nameConflict) {
        throw new ConflictException(
          `Entity name "${nextName}" already exists`,
        );
      }
    }

    if (updateDto.code !== undefined) entity.code = nextCode;
    if (updateDto.name !== undefined) entity.name = nextName;
    if (updateDto.business_unit !== undefined) {
      entity.business_unit = updateDto.business_unit?.trim() || null;
    }
    if (updateDto.legal_entity !== undefined) {
      entity.legal_entity = updateDto.legal_entity?.trim() || null;
    }
    if (updateDto.liability_distribution !== undefined) {
      entity.liability_distribution =
        updateDto.liability_distribution?.trim() || null;
    }
    if (updateDto.prepayment_distribution !== undefined) {
      entity.prepayment_distribution =
        updateDto.prepayment_distribution?.trim() || null;
    }
    if (updateDto.shipping_addresses !== undefined) {
      entity.shipping_addresses =
        sanitizeAddresses(updateDto.shipping_addresses) ?? [];
    }
    if (updateDto.billing_addresses !== undefined) {
      entity.billing_addresses =
        sanitizeAddresses(updateDto.billing_addresses) ?? [];
    }
    if (updateDto.status !== undefined) entity.status = updateDto.status;

    entity.updated_by = userEmailId ?? updateDto.updated_by ?? null;
    entity.updated_date = new Date();

    return EntityRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await EntityRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Entity not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateEntityStatusDto,
  ): Promise<UpdateResult> {
    const result = await EntityRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Entity not found');
  }
}
