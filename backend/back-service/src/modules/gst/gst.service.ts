import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Gst } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateGstDto } from './dto/create-gst.dto';
import { GetGstFilterDto } from './dto/gst-filter.dto';
import { UpdateGstDto } from './dto/update-gst.dto';
import { UpdateGstStatusDto } from './dto/update-status.dto';
import { gstRepository } from './repository/gst.repository';

interface GstListResponse {
  rows: Gst[];
  count: number;
}

@Injectable()
export class GstService {
  async create(
    createDto: CreateGstDto,
    userEmailId: string | null,
  ): Promise<Gst> {
    const code = createDto.code?.trim();
    const name = createDto.name?.trim();
    if (!code) throw new ConflictException('Code is required');
    if (!name) throw new ConflictException('Name is required');

    const codeConflict = await gstRepository.createQueryBuilder('gst')
      .where('LOWER(gst.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(`GST code "${code}" already exists`);
    }

    const nameConflict = await gstRepository.createQueryBuilder('gst')
      .where('LOWER(gst.name) = LOWER(:name)', { name })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(`GST name "${name}" already exists`);
    }

    const entity = gstRepository.create({
      ...createDto,
      code,
      name,
      percentage: String(createDto.percentage),
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
      created_date: new Date(),
    });

    return gstRepository.save(entity);
  }

  async findAll(
    filterDto: GetGstFilterDto,
  ): Promise<PageDto<Gst> | GstListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = gstRepository.createQueryBuilder('gst').select([
      'gst.id',
      'gst.name',
      'gst.code',
      'gst.percentage',
      'gst.status',
      'gst.created_date',
      'gst.updated_date',
    ]);

    if (name) {
      query.andWhere(
        '(LOWER(gst.name) LIKE LOWER(:name) OR LOWER(gst.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (status !== undefined && status !== null) {
      query.andWhere('gst.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`gst.${sortColumn}`, order);

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

  async findOne(id: number): Promise<Gst> {
    const entity = await gstRepository.findOne({
      where: { id },
      select: ['id', 'name', 'code', 'percentage', 'status'],
    });
    if (!entity) throw new NotFoundException('GST not found');
    return entity;
  }

  async update(
    id: number,
    updateDto: UpdateGstDto,
    userEmailId: string | null,
  ): Promise<Gst> {
    const entity = await gstRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('GST not found');

    const nextCode = updateDto.code?.trim() ?? entity.code;
    const nextName = updateDto.name?.trim() ?? entity.name;

    if (nextCode !== entity.code) {
      const codeConflict = await gstRepository.createQueryBuilder('gst')
        .where('LOWER(gst.code) = LOWER(:code)', { code: nextCode })
        .andWhere('gst.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(`GST code "${nextCode}" already exists`);
      }
    }

    if (nextName !== entity.name) {
      const nameConflict = await gstRepository.createQueryBuilder('gst')
        .where('LOWER(gst.name) = LOWER(:name)', { name: nextName })
        .andWhere('gst.id != :id', { id })
        .getOne();
      if (nameConflict) {
        throw new ConflictException(`GST name "${nextName}" already exists`);
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

    return gstRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await gstRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('GST not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateGstStatusDto,
  ): Promise<UpdateResult> {
    const result = await gstRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('GST not found');
  }
}
