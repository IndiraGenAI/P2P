import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Item } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { GetItemFilterDto } from './dto/item-filter.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { UpdateItemStatusDto } from './dto/update-status.dto';
import { itemRepository } from './repository/item.repository';
import { itemTypeRepository } from '../item-type/repository/item-type.repository';
import { itemCategoryRepository } from '../item-category/repository/item-category.repository';
import { uomRepository } from '../../other/uom/repository/uom.repository';
import { coaRepository } from '../../coa/repository/coa.repository';

interface ItemListResponse {
  rows: Item[];
  count: number;
}

@Injectable()
export class ItemService {
  private async assertItemTypeExists(id: number): Promise<void> {
    const found = await itemTypeRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Item type id=${id} not found`);
  }

  private async assertItemCategoryExists(id: number): Promise<void> {
    const found = await itemCategoryRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Item category id=${id} not found`);
  }

  private async assertUomExists(id: number): Promise<void> {
    const found = await uomRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`UOM id=${id} not found`);
  }

  private async assertCoaExists(id: number): Promise<void> {
    const found = await coaRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`COA id=${id} not found`);
  }

  async create(
    createDto: CreateItemDto,
    userEmailId: string | null,
  ): Promise<Item> {
    const code = createDto.code?.trim();
    const name = createDto.name?.trim();
    if (!code) throw new ConflictException('Code is required');
    if (!name) throw new ConflictException('Name is required');

    if (createDto.item_type_id) {
      await this.assertItemTypeExists(createDto.item_type_id);
    }
    if (createDto.item_category_id) {
      await this.assertItemCategoryExists(createDto.item_category_id);
    }
    if (createDto.uom_id) {
      await this.assertUomExists(createDto.uom_id);
    }
    if (createDto.coa_id) {
      await this.assertCoaExists(createDto.coa_id);
    }

    const codeConflict = await itemRepository.createQueryBuilder('item')
      .where('LOWER(item.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(`Item code "${code}" already exists`);
    }

    const entity = itemRepository.create({
      ...createDto,
      code,
      name,
      item_type_id: createDto.item_type_id ?? null,
      item_category_id: createDto.item_category_id ?? null,
      uom_id: createDto.uom_id ?? null,
      coa_id: createDto.coa_id ?? null,
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
      created_date: new Date(),
    });

    return itemRepository.save(entity);
  }

  async findAll(
    filterDto: GetItemFilterDto,
  ): Promise<PageDto<Item> | ItemListResponse> {
    const { name, status, item_type_id, item_category_id, orderBy, order } =
      filterDto;

    const query = itemRepository.createQueryBuilder('item')
      .leftJoin('item.item_type', 'item_type')
      .leftJoin('item.item_category', 'item_category')
      .leftJoin('item.uom', 'uom')
      .leftJoin('item.coa', 'coa')
      .select([
        'item.id',
        'item.name',
        'item.code',
        'item.item_type_id',
        'item.item_category_id',
        'item.uom_id',
        'item.coa_id',
        'item.status',
        'item.created_date',
        'item.updated_date',
        'item_type.id',
        'item_type.name',
        'item_category.id',
        'item_category.name',
        'uom.id',
        'uom.name',
        'coa.id',
        'coa.gl_code',
        'coa.gl_name',
      ]);

    if (name) {
      query.andWhere(
        '(LOWER(item.name) LIKE LOWER(:name) OR LOWER(item.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (item_type_id !== undefined && item_type_id !== null) {
      query.andWhere('item.item_type_id = :item_type_id', { item_type_id });
    }

    if (item_category_id !== undefined && item_category_id !== null) {
      query.andWhere('item.item_category_id = :item_category_id', {
        item_category_id,
      });
    }

    if (status !== undefined && status !== null) {
      query.andWhere('item.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`item.${sortColumn}`, order);

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

  async findOne(id: number): Promise<Item> {
    const entity = await itemRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        code: true,
        item_type_id: true,
        item_category_id: true,
        uom_id: true,
        coa_id: true,
        status: true,
        item_type: { id: true, name: true },
        item_category: { id: true, name: true },
        uom: { id: true, name: true },
        coa: { id: true, gl_code: true, gl_name: true },
      },
      relations: ['item_type', 'item_category', 'uom', 'coa'],
    });
    if (!entity) throw new NotFoundException('Item not found');
    return entity;
  }

  async update(
    id: number,
    updateDto: UpdateItemDto,
    userEmailId: string | null,
  ): Promise<Item> {
    const entity = await itemRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Item not found');

    if (
      updateDto.item_type_id !== undefined &&
      updateDto.item_type_id !== null &&
      updateDto.item_type_id !== entity.item_type_id
    ) {
      await this.assertItemTypeExists(updateDto.item_type_id);
    }
    if (
      updateDto.item_category_id !== undefined &&
      updateDto.item_category_id !== null &&
      updateDto.item_category_id !== entity.item_category_id
    ) {
      await this.assertItemCategoryExists(updateDto.item_category_id);
    }
    if (
      updateDto.uom_id !== undefined &&
      updateDto.uom_id !== null &&
      updateDto.uom_id !== entity.uom_id
    ) {
      await this.assertUomExists(updateDto.uom_id);
    }
    if (
      updateDto.coa_id !== undefined &&
      updateDto.coa_id !== null &&
      updateDto.coa_id !== entity.coa_id
    ) {
      await this.assertCoaExists(updateDto.coa_id);
    }

    const nextCode = updateDto.code?.trim() ?? entity.code;
    const nextName = updateDto.name?.trim() ?? entity.name;

    if (nextCode !== entity.code) {
      const codeConflict = await itemRepository.createQueryBuilder('item')
        .where('LOWER(item.code) = LOWER(:code)', { code: nextCode })
        .andWhere('item.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `Item code "${nextCode}" already exists`,
        );
      }
    }

    if (updateDto.code !== undefined) entity.code = nextCode;
    if (updateDto.name !== undefined) entity.name = nextName;
    if (updateDto.item_type_id !== undefined) {
      entity.item_type_id = updateDto.item_type_id ?? null;
    }
    if (updateDto.item_category_id !== undefined) {
      entity.item_category_id = updateDto.item_category_id ?? null;
    }
    if (updateDto.uom_id !== undefined) {
      entity.uom_id = updateDto.uom_id ?? null;
    }
    if (updateDto.coa_id !== undefined) {
      entity.coa_id = updateDto.coa_id ?? null;
    }
    if (updateDto.status !== undefined) entity.status = updateDto.status;

    entity.updated_by = userEmailId ?? updateDto.updated_by ?? null;
    entity.updated_date = new Date();

    return itemRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await itemRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Item not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateItemStatusDto,
  ): Promise<UpdateResult> {
    const result = await itemRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Item not found');
  }
}
