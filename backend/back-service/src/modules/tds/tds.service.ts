import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Tds } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateTdsDto } from './dto/create-tds.dto';
import { GetTdsFilterDto } from './dto/tds-filter.dto';
import { UpdateTdsDto } from './dto/update-tds.dto';
import { UpdateTdsStatusDto } from './dto/update-status.dto';
import { TdsRepository } from './tds.repository';

interface TdsListResponse {
  rows: Tds[];
  count: number;
}

@Injectable()
export class TdsService {
  async createTds(
    createDto: CreateTdsDto,
    userEmailId: string | null,
  ): Promise<Tds> {
    const code = createDto.code?.trim();
    const name = createDto.name?.trim();
    if (!code) throw new ConflictException('Code is required');
    if (!name) throw new ConflictException('Name is required');

    const codeConflict = await TdsRepository.createQueryBuilder('t')
      .where('LOWER(t.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(`TDS code "${code}" already exists`);
    }

    const nameConflict = await TdsRepository.createQueryBuilder('t')
      .where('LOWER(t.name) = LOWER(:name)', { name })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(`TDS name "${name}" already exists`);
    }

    const entity = TdsRepository.create({
      ...createDto,
      code,
      name,
      percentage: String(createDto.percentage),
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
      created_date: new Date(),
    });

    return TdsRepository.save(entity);
  }

  async findAllWithFilter(
    filterDto: GetTdsFilterDto,
  ): Promise<PageDto<Tds> | TdsListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = TdsRepository.createQueryBuilder('t');

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

  async findOne(id: number): Promise<Tds> {
    const entity = await TdsRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('TDS not found');
    return entity;
  }

  async updateTds(
    id: number,
    updateDto: UpdateTdsDto,
    userEmailId: string | null,
  ): Promise<Tds> {
    const entity = await TdsRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('TDS not found');

    const nextCode = updateDto.code?.trim() ?? entity.code;
    const nextName = updateDto.name?.trim() ?? entity.name;

    if (nextCode !== entity.code) {
      const codeConflict = await TdsRepository.createQueryBuilder('t')
        .where('LOWER(t.code) = LOWER(:code)', { code: nextCode })
        .andWhere('t.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(`TDS code "${nextCode}" already exists`);
      }
    }

    if (nextName !== entity.name) {
      const nameConflict = await TdsRepository.createQueryBuilder('t')
        .where('LOWER(t.name) = LOWER(:name)', { name: nextName })
        .andWhere('t.id != :id', { id })
        .getOne();
      if (nameConflict) {
        throw new ConflictException(`TDS name "${nextName}" already exists`);
      }
    }

    if (updateDto.code !== undefined) entity.code = nextCode;
    if (updateDto.name !== undefined) entity.name = nextName;
    if (updateDto.percentage !== undefined) {
      entity.percentage = String(updateDto.percentage);
    }
    if (updateDto.status !== undefined) entity.status = updateDto.status;

    entity.updated_by = userEmailId ?? updateDto.updated_by ?? null;
    entity.updated_date = new Date();

    return TdsRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await TdsRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('TDS not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateTdsStatusDto,
  ): Promise<UpdateResult> {
    const result = await TdsRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('TDS not found');
  }
}
