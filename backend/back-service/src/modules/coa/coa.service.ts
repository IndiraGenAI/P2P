import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Coa } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateCoaDto } from './dto/create-coa.dto';
import { GetCoaFilterDto } from './dto/coa-filter.dto';
import { UpdateCoaDto } from './dto/update-coa.dto';
import { UpdateCoaStatusDto } from './dto/update-status.dto';
import { coaRepository } from './repository/coa.repository';
import { coaCategoryRepository } from '../coa-category/repository/coa-category.repository';

interface CoaListResponse {
  rows: Coa[];
  count: number;
}

@Injectable()
export class CoaService {
  private async assertCategoryExists(categoryId: number): Promise<void> {
    const category = await coaCategoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `COA category id=${categoryId} not found`,
      );
    }
  }

  async create(
    createDto: CreateCoaDto,
    userEmailId: string | null,
  ): Promise<Coa> {
    const glCode = createDto.gl_code?.trim();
    const glName = createDto.gl_name?.trim();
    const distribution = createDto.distribution_combination?.trim();
    if (!glCode) throw new ConflictException('GL code is required');
    if (!glName) throw new ConflictException('GL name is required');
    if (!distribution) {
      throw new ConflictException('Distribution combination is required');
    }

    await this.assertCategoryExists(createDto.coa_category_id);

    const codeConflict = await coaRepository.createQueryBuilder('coa')
      .where('LOWER(coa.gl_code) = LOWER(:code)', { code: glCode })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(`GL code "${glCode}" already exists`);
    }

    const nameConflict = await coaRepository.createQueryBuilder('coa')
      .where('LOWER(coa.gl_name) = LOWER(:name)', { name: glName })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(`GL name "${glName}" already exists`);
    }

    const entity = coaRepository.create({
      ...createDto,
      gl_code: glCode,
      gl_name: glName,
      distribution_combination: distribution,
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
    });

    return coaRepository.save(entity);
  }

  async findAll(
    filterDto: GetCoaFilterDto,
  ): Promise<PageDto<Coa> | CoaListResponse> {
    const { name, status, coa_category_id, orderBy, order } = filterDto;

    const query = coaRepository.createQueryBuilder('coa')
      .leftJoin('coa.coa_category', 'coa_category')
      .select([
        'coa.id',
        'coa.gl_code',
        'coa.gl_name',
        'coa.distribution_combination',
        'coa.coa_category_id',
        'coa.status',
        'coa.created_date',
        'coa.updated_date',
        'coa_category.id',
        'coa_category.name',
      ]);

    if (name) {
      query.andWhere(
        '(LOWER(coa.gl_name) LIKE LOWER(:name) OR LOWER(coa.gl_code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (coa_category_id !== undefined && coa_category_id !== null) {
      query.andWhere('coa.coa_category_id = :coa_category_id', {
        coa_category_id,
      });
    }

    if (status !== undefined && status !== null) {
      query.andWhere('coa.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`coa.${sortColumn}`, order);

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

  async findOne(id: number): Promise<Coa> {
    const entity = await coaRepository.findOne({
      where: { id },
      select: {
        id: true,
        gl_code: true,
        gl_name: true,
        distribution_combination: true,
        coa_category_id: true,
        status: true,
        coa_category: { id: true, name: true },
      },
      relations: ['coa_category'],
    });
    if (!entity) throw new NotFoundException('COA not found');
    return entity;
  }

  async update(
    id: number,
    updateDto: UpdateCoaDto,
    userEmailId: string | null,
  ): Promise<Coa> {
    const entity = await coaRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('COA not found');

    if (
      updateDto.coa_category_id !== undefined &&
      updateDto.coa_category_id !== entity.coa_category_id
    ) {
      await this.assertCategoryExists(updateDto.coa_category_id);
    }

    const nextGlCode = updateDto.gl_code?.trim() ?? entity.gl_code;
    const nextGlName = updateDto.gl_name?.trim() ?? entity.gl_name;
    const nextDistribution =
      updateDto.distribution_combination?.trim() ??
      entity.distribution_combination;

    if (nextGlCode !== entity.gl_code) {
      const codeConflict = await coaRepository.createQueryBuilder('coa')
        .where('LOWER(coa.gl_code) = LOWER(:code)', { code: nextGlCode })
        .andWhere('coa.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `GL code "${nextGlCode}" already exists`,
        );
      }
    }

    if (nextGlName !== entity.gl_name) {
      const nameConflict = await coaRepository.createQueryBuilder('coa')
        .where('LOWER(coa.gl_name) = LOWER(:name)', { name: nextGlName })
        .andWhere('coa.id != :id', { id })
        .getOne();
      if (nameConflict) {
        throw new ConflictException(
          `GL name "${nextGlName}" already exists`,
        );
      }
    }

    if (updateDto.coa_category_id !== undefined) {
      entity.coa_category_id = updateDto.coa_category_id;
    }
    if (updateDto.gl_code !== undefined) entity.gl_code = nextGlCode;
    if (updateDto.gl_name !== undefined) entity.gl_name = nextGlName;
    if (updateDto.distribution_combination !== undefined) {
      entity.distribution_combination = nextDistribution;
    }
    if (updateDto.status !== undefined) entity.status = updateDto.status;

    entity.updated_by = userEmailId ?? updateDto.updated_by ?? null;

    return coaRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await coaRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('COA not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateCoaStatusDto,
  ): Promise<UpdateResult> {
    const result = await coaRepository.update(id, {
      ...updateStatusDto,
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('COA not found');
  }
}
