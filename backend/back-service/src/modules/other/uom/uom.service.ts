import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Uom } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateUomDto } from './dto/create-uom.dto';
import { GetUomFilterDto } from './dto/uom-filter.dto';
import { UpdateUomDto } from './dto/update-uom.dto';
import { UpdateUomStatusDto } from './dto/update-status.dto';
import { uomRepository } from './repository/uom.repository';

interface UomListResponse {
  rows: Uom[];
  count: number;
}

@Injectable()
export class UomService {
  async create(
    createDto: CreateUomDto,
    userEmailId: string | null,
  ): Promise<Uom> {
    const code = createDto.code?.trim();
    const name = createDto.name?.trim();
    if (!code) throw new ConflictException('Code is required');
    if (!name) throw new ConflictException('Name is required');

    const codeConflict = await uomRepository.createQueryBuilder('uom')
      .where('LOWER(uom.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(`UOM code "${code}" already exists`);
    }

    const nameConflict = await uomRepository.createQueryBuilder('uom')
      .where('LOWER(uom.name) = LOWER(:name)', { name })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(`UOM name "${name}" already exists`);
    }

    const entity = uomRepository.create({
      ...createDto,
      code,
      name,
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
      created_date: new Date(),
    });

    return uomRepository.save(entity);
  }

  async findAll(
    filterDto: GetUomFilterDto,
  ): Promise<PageDto<Uom> | UomListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = uomRepository.createQueryBuilder('uom').select([
      'uom.id',
      'uom.name',
      'uom.code',
      'uom.status',
      'uom.created_date',
      'uom.updated_date',
    ]);

    if (name) {
      query.andWhere(
        '(LOWER(uom.name) LIKE LOWER(:name) OR LOWER(uom.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (status !== undefined && status !== null) {
      query.andWhere('uom.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`uom.${sortColumn}`, order);

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

  async findOne(id: number): Promise<Uom> {
    const entity = await uomRepository.findOne({
      where: { id },
      select: ['id', 'name', 'code', 'status'],
    });
    if (!entity) throw new NotFoundException('UOM not found');
    return entity;
  }

  async update(
    id: number,
    updateDto: UpdateUomDto,
    userEmailId: string | null,
  ): Promise<Uom> {
    const entity = await uomRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('UOM not found');

    const nextCode = updateDto.code?.trim() ?? entity.code;
    const nextName = updateDto.name?.trim() ?? entity.name;

    if (nextCode !== entity.code) {
      const codeConflict = await uomRepository.createQueryBuilder('uom')
        .where('LOWER(uom.code) = LOWER(:code)', { code: nextCode })
        .andWhere('uom.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(`UOM code "${nextCode}" already exists`);
      }
    }

    if (nextName !== entity.name) {
      const nameConflict = await uomRepository.createQueryBuilder('uom')
        .where('LOWER(uom.name) = LOWER(:name)', { name: nextName })
        .andWhere('uom.id != :id', { id })
        .getOne();
      if (nameConflict) {
        throw new ConflictException(`UOM name "${nextName}" already exists`);
      }
    }

    if (updateDto.code !== undefined) entity.code = nextCode;
    if (updateDto.name !== undefined) entity.name = nextName;
    if (updateDto.status !== undefined) entity.status = updateDto.status;

    entity.updated_by = userEmailId ?? updateDto.updated_by ?? null;
    entity.updated_date = new Date();

    return uomRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await uomRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('UOM not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateUomStatusDto,
  ): Promise<UpdateResult> {
    const result = await uomRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('UOM not found');
  }
}
