import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { TermsCondition } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateTermsConditionDto } from './dto/create-terms-condition.dto';
import { GetTermsConditionFilterDto } from './dto/terms-condition-filter.dto';
import { UpdateTermsConditionDto } from './dto/update-terms-condition.dto';
import { UpdateTermsConditionStatusDto } from './dto/update-status.dto';
import { termsConditionRepository } from './repository/terms-condition.repository';

interface TermsConditionListResponse {
  rows: TermsCondition[];
  count: number;
}

@Injectable()
export class TermsConditionService {
  async create(
    createDto: CreateTermsConditionDto,
    userEmailId: string | null,
  ): Promise<TermsCondition> {
    const code = createDto.code?.trim();
    const name = createDto.name?.trim();
    if (!code) throw new ConflictException('Code is required');
    if (!name) throw new ConflictException('Name is required');

    const codeConflict = await termsConditionRepository.createQueryBuilder('terms_condition')
      .where('LOWER(terms_condition.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(
        `Terms & condition code "${code}" already exists`,
      );
    }

    const nameConflict = await termsConditionRepository.createQueryBuilder('terms_condition')
      .where('LOWER(terms_condition.name) = LOWER(:name)', { name })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(
        `Terms & condition name "${name}" already exists`,
      );
    }

    const entity = termsConditionRepository.create({
      ...createDto,
      code,
      name,
      description: createDto.description?.trim() || null,
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
      created_date: new Date(),
    });

    return termsConditionRepository.save(entity);
  }

  async findAll(
    filterDto: GetTermsConditionFilterDto,
  ): Promise<PageDto<TermsCondition> | TermsConditionListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = termsConditionRepository.createQueryBuilder('terms_condition').select([
      'terms_condition.id',
      'terms_condition.name',
      'terms_condition.code',
      'terms_condition.status',
      'terms_condition.created_date',
      'terms_condition.updated_date',
    ]);

    if (name) {
      query.andWhere(
        '(LOWER(terms_condition.name) LIKE LOWER(:name) OR LOWER(terms_condition.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (status !== undefined && status !== null) {
      query.andWhere('terms_condition.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`terms_condition.${sortColumn}`, order);

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

  async findOne(id: number): Promise<TermsCondition> {
    const entity = await termsConditionRepository.findOne({
      where: { id },
      select: ['id', 'name', 'code', 'description', 'status'],
    });
    if (!entity) throw new NotFoundException('Terms & condition not found');
    return entity;
  }

  async update(
    id: number,
    updateDto: UpdateTermsConditionDto,
    userEmailId: string | null,
  ): Promise<TermsCondition> {
    const entity = await termsConditionRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Terms & condition not found');

    const nextCode = updateDto.code?.trim() ?? entity.code;
    const nextName = updateDto.name?.trim() ?? entity.name;

    if (nextCode !== entity.code) {
      const codeConflict = await termsConditionRepository.createQueryBuilder(
        't',
      )
        .where('LOWER(terms_condition.code) = LOWER(:code)', { code: nextCode })
        .andWhere('terms_condition.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `Terms & condition code "${nextCode}" already exists`,
        );
      }
    }

    if (nextName !== entity.name) {
      const nameConflict = await termsConditionRepository.createQueryBuilder(
        't',
      )
        .where('LOWER(terms_condition.name) = LOWER(:name)', { name: nextName })
        .andWhere('terms_condition.id != :id', { id })
        .getOne();
      if (nameConflict) {
        throw new ConflictException(
          `Terms & condition name "${nextName}" already exists`,
        );
      }
    }

    if (updateDto.code !== undefined) entity.code = nextCode;
    if (updateDto.name !== undefined) entity.name = nextName;
    if (updateDto.description !== undefined) {
      entity.description = updateDto.description?.trim() || null;
    }
    if (updateDto.status !== undefined) entity.status = updateDto.status;

    entity.updated_by = userEmailId ?? updateDto.updated_by ?? null;
    entity.updated_date = new Date();

    return termsConditionRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await termsConditionRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Terms & condition not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateTermsConditionStatusDto,
  ): Promise<UpdateResult> {
    const result = await termsConditionRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Terms & condition not found');
  }
}
