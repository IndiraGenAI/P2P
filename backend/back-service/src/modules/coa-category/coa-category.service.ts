import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CoaCategory } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateCoaCategoryDto } from './dto/create-coa-category.dto';
import { GetCoaCategoryFilterDto } from './dto/coa-category-filter.dto';
import { UpdateCoaCategoryDto } from './dto/update-coa-category.dto';
import { UpdateCoaCategoryStatusDto } from './dto/update-status.dto';
import { CoaCategoryRepository } from './coa-category.repository';

interface CoaCategoryListResponse {
  rows: CoaCategory[];
  count: number;
}

@Injectable()
export class CoaCategoryService {
  async createCoaCategory(
    createDto: CreateCoaCategoryDto,
    userEmailId: string | null,
  ): Promise<CoaCategory> {
    const name = createDto.name?.trim();
    if (!name) throw new ConflictException('Name is required');

    const nameConflict = await CoaCategoryRepository.createQueryBuilder('c')
      .where('LOWER(c.name) = LOWER(:name)', { name })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(
        `COA category "${name}" already exists`,
      );
    }

    const entity = CoaCategoryRepository.create({
      ...createDto,
      name,
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
      created_date: new Date(),
    });

    return CoaCategoryRepository.save(entity);
  }

  async findAllWithFilter(
    filterDto: GetCoaCategoryFilterDto,
  ): Promise<PageDto<CoaCategory> | CoaCategoryListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = CoaCategoryRepository.createQueryBuilder('c');

    if (name) {
      query.andWhere('LOWER(c.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
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

  async findOne(id: number): Promise<CoaCategory> {
    const entity = await CoaCategoryRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('COA category not found');
    return entity;
  }

  async updateCoaCategory(
    id: number,
    updateDto: UpdateCoaCategoryDto,
    userEmailId: string | null,
  ): Promise<CoaCategory> {
    const entity = await CoaCategoryRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('COA category not found');

    const nextName = updateDto.name?.trim() ?? entity.name;

    if (nextName !== entity.name) {
      const nameConflict = await CoaCategoryRepository.createQueryBuilder('c')
        .where('LOWER(c.name) = LOWER(:name)', { name: nextName })
        .andWhere('c.id != :id', { id })
        .getOne();
      if (nameConflict) {
        throw new ConflictException(
          `COA category "${nextName}" already exists`,
        );
      }
    }

    if (updateDto.name !== undefined) entity.name = nextName;
    if (updateDto.status !== undefined) entity.status = updateDto.status;

    entity.updated_by = userEmailId ?? updateDto.updated_by ?? null;
    entity.updated_date = new Date();

    return CoaCategoryRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await CoaCategoryRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('COA category not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateCoaCategoryStatusDto,
  ): Promise<UpdateResult> {
    const result = await CoaCategoryRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('COA category not found');
  }
}
