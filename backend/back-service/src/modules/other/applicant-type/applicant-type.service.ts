import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ApplicantType } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateApplicantTypeDto } from './dto/create-applicant-type.dto';
import { GetApplicantTypeFilterDto } from './dto/applicant-type-filter.dto';
import { UpdateApplicantTypeDto } from './dto/update-applicant-type.dto';
import { UpdateApplicantTypeStatusDto } from './dto/update-status.dto';
import { ApplicantTypeRepository } from './repository/applicant-type.repository';

interface ApplicantTypeListResponse {
  rows: ApplicantType[];
  count: number;
}

@Injectable()
export class ApplicantTypeService {
  async create(
    createDto: CreateApplicantTypeDto,
    userEmailId: string | null,
  ): Promise<ApplicantType> {
    const code = createDto.code?.trim();
    const name = createDto.name?.trim();
    if (!code) throw new ConflictException('Code is required');
    if (!name) throw new ConflictException('Name is required');

    const codeConflict = await ApplicantTypeRepository.createQueryBuilder('a')
      .where('LOWER(a.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(
        `Applicant type code "${code}" already exists`,
      );
    }

    const nameConflict = await ApplicantTypeRepository.createQueryBuilder('a')
      .where('LOWER(a.name) = LOWER(:name)', { name })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(
        `Applicant type name "${name}" already exists`,
      );
    }

    const entity = ApplicantTypeRepository.create({
      ...createDto,
      code,
      name,
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
      created_date: new Date(),
    });

    return ApplicantTypeRepository.save(entity);
  }

  async findAll(
    filterDto: GetApplicantTypeFilterDto,
  ): Promise<PageDto<ApplicantType> | ApplicantTypeListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = ApplicantTypeRepository.createQueryBuilder('a');

    if (name) {
      query.andWhere(
        '(LOWER(a.name) LIKE LOWER(:name) OR LOWER(a.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (status !== undefined && status !== null) {
      query.andWhere('a.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`a.${sortColumn}`, order);

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

  async findOne(id: number): Promise<ApplicantType> {
    const entity = await ApplicantTypeRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Applicant type not found');
    return entity;
  }

  async update(
    id: number,
    updateDto: UpdateApplicantTypeDto,
    userEmailId: string | null,
  ): Promise<ApplicantType> {
    const entity = await ApplicantTypeRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Applicant type not found');

    const nextCode = updateDto.code?.trim() ?? entity.code;
    const nextName = updateDto.name?.trim() ?? entity.name;

    if (nextCode !== entity.code) {
      const codeConflict = await ApplicantTypeRepository.createQueryBuilder('a')
        .where('LOWER(a.code) = LOWER(:code)', { code: nextCode })
        .andWhere('a.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `Applicant type code "${nextCode}" already exists`,
        );
      }
    }

    if (nextName !== entity.name) {
      const nameConflict = await ApplicantTypeRepository.createQueryBuilder('a')
        .where('LOWER(a.name) = LOWER(:name)', { name: nextName })
        .andWhere('a.id != :id', { id })
        .getOne();
      if (nameConflict) {
        throw new ConflictException(
          `Applicant type name "${nextName}" already exists`,
        );
      }
    }

    if (updateDto.code !== undefined) entity.code = nextCode;
    if (updateDto.name !== undefined) entity.name = nextName;
    if (updateDto.status !== undefined) entity.status = updateDto.status;

    entity.updated_by = userEmailId ?? updateDto.updated_by ?? null;
    entity.updated_date = new Date();

    return ApplicantTypeRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await ApplicantTypeRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Applicant type not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateApplicantTypeStatusDto,
  ): Promise<UpdateResult> {
    const result = await ApplicantTypeRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Applicant type not found');
  }
}
