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
import { coaCategoryRepository } from './repository/coa-category.repository';

interface CoaCategoryListResponse {
  rows: CoaCategory[];
  count: number;
}

@Injectable()
export class CoaCategoryService {
  async create(
    createDto: CreateCoaCategoryDto,
    userEmailId: string | null,
  ): Promise<CoaCategory> {
    const name = createDto.name?.trim();
    if (!name) throw new ConflictException('Name is required');

    const nameConflict = await coaCategoryRepository.createQueryBuilder('coa_category')
      .where('LOWER(coa_category.name) = LOWER(:name)', { name })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(
        `COA category "${name}" already exists`,
      );
    }

    const entity = coaCategoryRepository.create({
      ...createDto,
      name,
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
    });

    return coaCategoryRepository.save(entity);
  }

  async findAll(
    filterDto: GetCoaCategoryFilterDto,
  ): Promise<PageDto<CoaCategory> | CoaCategoryListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = coaCategoryRepository.createQueryBuilder('coa_category').select([
      'coa_category.id',
      'coa_category.name',
      'coa_category.status',
      'coa_category.created_date',
      'coa_category.updated_date',
    ]);

    if (name) {
      query.andWhere('LOWER(coa_category.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    if (status !== undefined && status !== null) {
      query.andWhere('coa_category.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`coa_category.${sortColumn}`, order);

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
    const entity = await coaCategoryRepository.findOne({
      where: { id },
      select: ['id', 'name', 'status'],
    });
    if (!entity) throw new NotFoundException('COA category not found');
    return entity;
  }

  async update(
    id: number,
    updateDto: UpdateCoaCategoryDto,
    userEmailId: string | null,
  ): Promise<CoaCategory> {
    const entity = await coaCategoryRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('COA category not found');

    const nextName = updateDto.name?.trim() ?? entity.name;

    if (nextName !== entity.name) {
      const nameConflict = await coaCategoryRepository.createQueryBuilder('coa_category')
        .where('LOWER(coa_category.name) = LOWER(:name)', { name: nextName })
        .andWhere('coa_category.id != :id', { id })
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

    return coaCategoryRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await coaCategoryRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('COA category not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateCoaCategoryStatusDto,
  ): Promise<UpdateResult> {
    const result = await coaCategoryRepository.update(id, {
      ...updateStatusDto,
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('COA category not found');
  }
}
