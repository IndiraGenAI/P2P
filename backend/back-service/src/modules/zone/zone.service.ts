import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Zone } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateZoneDto } from './dto/create-zone.dto';
import { GetZoneFilterDto } from './dto/zone-filter.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { UpdateZoneStatusDto } from './dto/update-status.dto';
import { ZoneRepository } from './zone.repository';

interface ZoneListResponse {
  rows: Zone[];
  count: number;
}

@Injectable()
export class ZoneService {
  async createZone(
    createZoneDto: CreateZoneDto,
    userEmailId: string | null,
  ): Promise<Zone> {
    const name = createZoneDto.name?.trim();
    if (!name) {
      throw new ConflictException('Zone name is required');
    }
    if (!createZoneDto.country_id) {
      throw new ConflictException('Country is required');
    }

    const existing = await ZoneRepository.createQueryBuilder('zone')
      .where('LOWER(zone.name) = LOWER(:name)', { name })
      .andWhere('zone.country_id = :country_id', {
        country_id: createZoneDto.country_id,
      })
      .getOne();
    if (existing) {
      throw new ConflictException(
        `Zone "${name}" already exists for this country`,
      );
    }

    const zone = ZoneRepository.create({
      ...createZoneDto,
      name,
      code: createZoneDto.code?.trim() ?? null,
      status: createZoneDto.status ?? true,
      created_by: userEmailId ?? createZoneDto.created_by ?? null,
      created_date: new Date(),
    });

    return ZoneRepository.save(zone);
  }

  async findAllWithFilter(
    filterDto: GetZoneFilterDto,
  ): Promise<PageDto<Zone> | ZoneListResponse> {
    const { name, country_id, status, orderBy, order } = filterDto;

    const query = ZoneRepository.createQueryBuilder('zone').leftJoinAndSelect(
      'zone.country',
      'country',
    );

    if (name) {
      query.andWhere(
        '(LOWER(zone.name) LIKE LOWER(:name) OR LOWER(zone.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (country_id) {
      query.andWhere('zone.country_id = :country_id', { country_id });
    }

    if (status !== undefined && status !== null) {
      query.andWhere('zone.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`zone.${sortColumn}`, order);

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

  async findOne(id: number): Promise<Zone> {
    const zone = await ZoneRepository.findOne({
      where: { id },
      relations: { country: true },
    });
    if (!zone) {
      throw new NotFoundException('Zone not found');
    }
    return zone;
  }

  async updateZone(
    id: number,
    updateZoneDto: UpdateZoneDto,
    userEmailId: string | null,
  ): Promise<Zone> {
    const zone = await ZoneRepository.findOne({ where: { id } });
    if (!zone) {
      throw new NotFoundException('Zone not found');
    }

    const nextName = updateZoneDto.name?.trim() ?? zone.name;
    const nextCountryId = updateZoneDto.country_id ?? zone.country_id;

    if (nextName !== zone.name || nextCountryId !== zone.country_id) {
      const conflict = await ZoneRepository.createQueryBuilder('zone')
        .where('LOWER(zone.name) = LOWER(:name)', { name: nextName })
        .andWhere('zone.country_id = :country_id', {
          country_id: nextCountryId,
        })
        .getOne();
      if (conflict && conflict.id !== id) {
        throw new ConflictException(
          `Zone "${nextName}" already exists for this country`,
        );
      }
    }

    if (updateZoneDto.name !== undefined) zone.name = nextName;
    if (updateZoneDto.country_id !== undefined) {
      zone.country_id = nextCountryId;
    }
    if (updateZoneDto.code !== undefined) {
      zone.code = updateZoneDto.code?.trim() || null;
    }
    if (updateZoneDto.status !== undefined) zone.status = updateZoneDto.status;

    zone.updated_by = userEmailId ?? updateZoneDto.updated_by ?? null;
    zone.updated_date = new Date();

    return ZoneRepository.save(zone);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await ZoneRepository.delete({ id });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Zone not found');
  }

  async updateZoneStatus(
    id: number,
    updateZoneStatusDto: UpdateZoneStatusDto,
  ): Promise<UpdateResult> {
    const result = await ZoneRepository.update(id, {
      ...updateZoneStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Zone not found');
  }
}
