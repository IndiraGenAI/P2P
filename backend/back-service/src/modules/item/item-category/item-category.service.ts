import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ItemCategory } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateItemCategoryDto } from './dto/create-item-category.dto';
import { GetItemCategoryFilterDto } from './dto/item-category-filter.dto';
import { UpdateItemCategoryDto } from './dto/update-item-category.dto';
import { UpdateItemCategoryStatusDto } from './dto/update-status.dto';
import { itemCategoryRepository } from './repository/item-category.repository';

interface ItemCategoryListResponse {
  rows: ItemCategory[];
  count: number;
}

@Injectable()
export class ItemCategoryService {
  async create(
    createDto: CreateItemCategoryDto,
    userEmailId: string | null,
  ): Promise<ItemCategory> {
    const code = createDto.code?.trim();
    const name = createDto.name?.trim();
    if (!code) throw new ConflictException('Code is required');
    if (!name) throw new ConflictException('Name is required');

    const codeConflict = await itemCategoryRepository.createQueryBuilder('item_category')
      .where('LOWER(item_category.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(
        `Item category code "${code}" already exists`,
      );
    }

    const nameConflict = await itemCategoryRepository.createQueryBuilder('item_category')
      .where('LOWER(item_category.name) = LOWER(:name)', { name })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(
        `Item category name "${name}" already exists`,
      );
    }

    const entity = itemCategoryRepository.create({
      ...createDto,
      code,
      name,
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
      created_date: new Date(),
    });

    return itemCategoryRepository.save(entity);
  }

  async findAll(
    filterDto: GetItemCategoryFilterDto,
  ): Promise<PageDto<ItemCategory> | ItemCategoryListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = itemCategoryRepository.createQueryBuilder('item_category').select([
      'item_category.id',
      'item_category.name',
      'item_category.code',
      'item_category.status',
      'item_category.created_date',
      'item_category.updated_date',
    ]);

    if (name) {
      query.andWhere(
        '(LOWER(item_category.name) LIKE LOWER(:name) OR LOWER(item_category.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (status !== undefined && status !== null) {
      query.andWhere('item_category.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`item_category.${sortColumn}`, order);

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

  async findOne(id: number): Promise<ItemCategory> {
    const entity = await itemCategoryRepository.findOne({
      where: { id },
      select: ['id', 'name', 'code', 'status'],
    });
    if (!entity) throw new NotFoundException('Item category not found');
    return entity;
  }

  async update(
    id: number,
    updateDto: UpdateItemCategoryDto,
    userEmailId: string | null,
  ): Promise<ItemCategory> {
    const entity = await itemCategoryRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Item category not found');

    const nextCode = updateDto.code?.trim() ?? entity.code;
    const nextName = updateDto.name?.trim() ?? entity.name;

    if (nextCode !== entity.code) {
      const codeConflict = await itemCategoryRepository.createQueryBuilder('item_category')
        .where('LOWER(item_category.code) = LOWER(:code)', { code: nextCode })
        .andWhere('item_category.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `Item category code "${nextCode}" already exists`,
        );
      }
    }

    if (nextName !== entity.name) {
      const nameConflict = await itemCategoryRepository.createQueryBuilder('item_category')
        .where('LOWER(item_category.name) = LOWER(:name)', { name: nextName })
        .andWhere('item_category.id != :id', { id })
        .getOne();
      if (nameConflict) {
        throw new ConflictException(
          `Item category name "${nextName}" already exists`,
        );
      }
    }

    if (updateDto.code !== undefined) entity.code = nextCode;
    if (updateDto.name !== undefined) entity.name = nextName;
    if (updateDto.status !== undefined) entity.status = updateDto.status;

    entity.updated_by = userEmailId ?? updateDto.updated_by ?? null;
    entity.updated_date = new Date();

    return itemCategoryRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await itemCategoryRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Item category not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateItemCategoryStatusDto,
  ): Promise<UpdateResult> {
    const result = await itemCategoryRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Item category not found');
  }
}
