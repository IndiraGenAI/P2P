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
import { CoaRepository } from './coa.repository';
import { CoaCategoryRepository } from '../coa-category/coa-category.repository';

interface CoaListResponse {
  rows: Coa[];
  count: number;
}

@Injectable()
export class CoaService {
  private async assertCategoryExists(categoryId: number): Promise<void> {
    const category = await CoaCategoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `COA category id=${categoryId} not found`,
      );
    }
  }

  async createCoa(
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

    const codeConflict = await CoaRepository.createQueryBuilder('c')
      .where('LOWER(c.gl_code) = LOWER(:code)', { code: glCode })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(`GL code "${glCode}" already exists`);
    }

    const nameConflict = await CoaRepository.createQueryBuilder('c')
      .where('LOWER(c.gl_name) = LOWER(:name)', { name: glName })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(`GL name "${glName}" already exists`);
    }

    const entity = CoaRepository.create({
      ...createDto,
      gl_code: glCode,
      gl_name: glName,
      distribution_combination: distribution,
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
      created_date: new Date(),
    });

    return CoaRepository.save(entity);
  }

  async findAllWithFilter(
    filterDto: GetCoaFilterDto,
  ): Promise<PageDto<Coa> | CoaListResponse> {
    const { name, status, coa_category_id, orderBy, order } = filterDto;

    const query = CoaRepository.createQueryBuilder('c').leftJoinAndSelect(
      'c.coa_category',
      'coa_category',
    );

    if (name) {
      query.andWhere(
        '(LOWER(c.gl_name) LIKE LOWER(:name) OR LOWER(c.gl_code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (coa_category_id !== undefined && coa_category_id !== null) {
      query.andWhere('c.coa_category_id = :coa_category_id', {
        coa_category_id,
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

  async findOne(id: number): Promise<Coa> {
    const entity = await CoaRepository.findOne({
      where: { id },
      relations: ['coa_category'],
    });
    if (!entity) throw new NotFoundException('COA not found');
    return entity;
  }

  async updateCoa(
    id: number,
    updateDto: UpdateCoaDto,
    userEmailId: string | null,
  ): Promise<Coa> {
    const entity = await CoaRepository.findOne({ where: { id } });
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
      const codeConflict = await CoaRepository.createQueryBuilder('c')
        .where('LOWER(c.gl_code) = LOWER(:code)', { code: nextGlCode })
        .andWhere('c.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `GL code "${nextGlCode}" already exists`,
        );
      }
    }

    if (nextGlName !== entity.gl_name) {
      const nameConflict = await CoaRepository.createQueryBuilder('c')
        .where('LOWER(c.gl_name) = LOWER(:name)', { name: nextGlName })
        .andWhere('c.id != :id', { id })
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
    entity.updated_date = new Date();

    return CoaRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await CoaRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('COA not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateCoaStatusDto,
  ): Promise<UpdateResult> {
    const result = await CoaRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('COA not found');
  }
}
