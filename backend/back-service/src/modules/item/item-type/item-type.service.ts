import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ItemType } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateItemTypeDto } from './dto/create-item-type.dto';
import { GetItemTypeFilterDto } from './dto/item-type-filter.dto';
import { UpdateItemTypeDto } from './dto/update-item-type.dto';
import { UpdateItemTypeStatusDto } from './dto/update-status.dto';
import { ItemTypeRepository } from './repository/item-type.repository';

interface ItemTypeListResponse {
  rows: ItemType[];
  count: number;
}

@Injectable()
export class ItemTypeService {
  async create(
    createDto: CreateItemTypeDto,
    userEmailId: string | null,
  ): Promise<ItemType> {
    const code = createDto.code?.trim();
    const name = createDto.name?.trim();
    if (!code) throw new ConflictException('Code is required');
    if (!name) throw new ConflictException('Name is required');

    const codeConflict = await ItemTypeRepository.createQueryBuilder('t')
      .where('LOWER(t.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(`Item type code "${code}" already exists`);
    }

    const nameConflict = await ItemTypeRepository.createQueryBuilder('t')
      .where('LOWER(t.name) = LOWER(:name)', { name })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(`Item type name "${name}" already exists`);
    }

    const entity = ItemTypeRepository.create({
      ...createDto,
      code,
      name,
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
      created_date: new Date(),
    });

    return ItemTypeRepository.save(entity);
  }

  async findAll(
    filterDto: GetItemTypeFilterDto,
  ): Promise<PageDto<ItemType> | ItemTypeListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = ItemTypeRepository.createQueryBuilder('t');

    if (name) {
      query.andWhere(
        '(LOWER(t.name) LIKE LOWER(:name) OR LOWER(t.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (status !== undefined && status !== null) {
      query.andWhere('t.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`t.${sortColumn}`, order);

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

  async findOne(id: number): Promise<ItemType> {
    const entity = await ItemTypeRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Item type not found');
    return entity;
  }

  async update(
    id: number,
    updateDto: UpdateItemTypeDto,
    userEmailId: string | null,
  ): Promise<ItemType> {
    const entity = await ItemTypeRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Item type not found');

    const nextCode = updateDto.code?.trim() ?? entity.code;
    const nextName = updateDto.name?.trim() ?? entity.name;

    if (nextCode !== entity.code) {
      const codeConflict = await ItemTypeRepository.createQueryBuilder('t')
        .where('LOWER(t.code) = LOWER(:code)', { code: nextCode })
        .andWhere('t.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `Item type code "${nextCode}" already exists`,
        );
      }
    }

    if (nextName !== entity.name) {
      const nameConflict = await ItemTypeRepository.createQueryBuilder('t')
        .where('LOWER(t.name) = LOWER(:name)', { name: nextName })
        .andWhere('t.id != :id', { id })
        .getOne();
      if (nameConflict) {
        throw new ConflictException(
          `Item type name "${nextName}" already exists`,
        );
      }
    }

    if (updateDto.code !== undefined) entity.code = nextCode;
    if (updateDto.name !== undefined) entity.name = nextName;
    if (updateDto.status !== undefined) entity.status = updateDto.status;

    entity.updated_by = userEmailId ?? updateDto.updated_by ?? null;
    entity.updated_date = new Date();

    return ItemTypeRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await ItemTypeRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Item type not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateItemTypeStatusDto,
  ): Promise<UpdateResult> {
    const result = await ItemTypeRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Item type not found');
  }
}
