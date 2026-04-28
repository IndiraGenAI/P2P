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
import { ItemRepository } from './repository/item.repository';
import { ItemTypeRepository } from '../item-type/repository/item-type.repository';
import { ItemCategoryRepository } from '../item-category/repository/item-category.repository';
import { UomRepository } from '../../other/uom/repository/uom.repository';
import { CoaRepository } from '../../coa/repository/coa.repository';

interface ItemListResponse {
  rows: Item[];
  count: number;
}

@Injectable()
export class ItemService {
  private async assertItemTypeExists(id: number): Promise<void> {
    const found = await ItemTypeRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Item type id=${id} not found`);
  }

  private async assertItemCategoryExists(id: number): Promise<void> {
    const found = await ItemCategoryRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Item category id=${id} not found`);
  }

  private async assertUomExists(id: number): Promise<void> {
    const found = await UomRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`UOM id=${id} not found`);
  }

  private async assertCoaExists(id: number): Promise<void> {
    const found = await CoaRepository.findOne({ where: { id } });
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

    const codeConflict = await ItemRepository.createQueryBuilder('i')
      .where('LOWER(i.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(`Item code "${code}" already exists`);
    }

    const entity = ItemRepository.create({
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

    return ItemRepository.save(entity);
  }

  async findAll(
    filterDto: GetItemFilterDto,
  ): Promise<PageDto<Item> | ItemListResponse> {
    const { name, status, item_type_id, item_category_id, orderBy, order } =
      filterDto;

    const query = ItemRepository.createQueryBuilder('i')
      .leftJoinAndSelect('i.item_type', 'item_type')
      .leftJoinAndSelect('i.item_category', 'item_category')
      .leftJoinAndSelect('i.uom', 'uom')
      .leftJoinAndSelect('i.coa', 'coa');

    if (name) {
      query.andWhere(
        '(LOWER(i.name) LIKE LOWER(:name) OR LOWER(i.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (item_type_id !== undefined && item_type_id !== null) {
      query.andWhere('i.item_type_id = :item_type_id', { item_type_id });
    }

    if (item_category_id !== undefined && item_category_id !== null) {
      query.andWhere('i.item_category_id = :item_category_id', {
        item_category_id,
      });
    }

    if (status !== undefined && status !== null) {
      query.andWhere('i.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`i.${sortColumn}`, order);

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
    const entity = await ItemRepository.findOne({
      where: { id },
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
    const entity = await ItemRepository.findOne({ where: { id } });
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
      const codeConflict = await ItemRepository.createQueryBuilder('i')
        .where('LOWER(i.code) = LOWER(:code)', { code: nextCode })
        .andWhere('i.id != :id', { id })
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

    return ItemRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await ItemRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Item not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateItemStatusDto,
  ): Promise<UpdateResult> {
    const result = await ItemRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Item not found');
  }
}
