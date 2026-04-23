import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Center } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateCenterDto } from './dto/create-center.dto';
import { GetCenterFilterDto } from './dto/center-filter.dto';
import { UpdateCenterDto } from './dto/update-center.dto';
import { UpdateCenterStatusDto } from './dto/update-status.dto';
import { CenterRepository } from './center.repository';

interface CenterListResponse {
  rows: Center[];
  count: number;
}

@Injectable()
export class CenterService {
  async createCenter(
    createCenterDto: CreateCenterDto,
    userEmailId: string | null,
  ): Promise<Center> {
    const code = createCenterDto.code?.trim();
    const name = createCenterDto.name?.trim();
    if (!code) {
      throw new ConflictException('Center code is required');
    }
    if (!name) {
      throw new ConflictException('Center name is required');
    }

    const codeConflict = await CenterRepository.createQueryBuilder('center')
      .where('LOWER(center.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(`Center code "${code}" already exists`);
    }

    const center = CenterRepository.create({
      ...createCenterDto,
      code,
      name,
      status: createCenterDto.status ?? true,
      created_by: userEmailId ?? createCenterDto.created_by ?? null,
      created_date: new Date(),
    });

    return CenterRepository.save(center);
  }

  async findAllWithFilter(
    filterDto: GetCenterFilterDto,
  ): Promise<PageDto<Center> | CenterListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = CenterRepository.createQueryBuilder('center');

    if (name) {
      query.andWhere(
        '(LOWER(center.name) LIKE LOWER(:name) OR LOWER(center.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (status !== undefined && status !== null) {
      query.andWhere('center.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`center.${sortColumn}`, order);

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

  async findOne(id: number): Promise<Center> {
    const center = await CenterRepository.findOne({ where: { id } });
    if (!center) {
      throw new NotFoundException('Center not found');
    }
    return center;
  }

  async updateCenter(
    id: number,
    updateCenterDto: UpdateCenterDto,
    userEmailId: string | null,
  ): Promise<Center> {
    const center = await CenterRepository.findOne({ where: { id } });
    if (!center) {
      throw new NotFoundException('Center not found');
    }

    const nextCode = updateCenterDto.code?.trim() ?? center.code;
    const nextName = updateCenterDto.name?.trim() ?? center.name;

    if (nextCode !== center.code) {
      const codeConflict = await CenterRepository.createQueryBuilder('center')
        .where('LOWER(center.code) = LOWER(:code)', { code: nextCode })
        .andWhere('center.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `Center code "${nextCode}" already exists`,
        );
      }
    }

    if (updateCenterDto.code !== undefined) center.code = nextCode;
    if (updateCenterDto.name !== undefined) center.name = nextName;
    if (updateCenterDto.status !== undefined) {
      center.status = updateCenterDto.status;
    }

    center.updated_by = userEmailId ?? updateCenterDto.updated_by ?? null;
    center.updated_date = new Date();

    return CenterRepository.save(center);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await CenterRepository.delete({ id });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Center not found');
  }

  async updateCenterStatus(
    id: number,
    updateCenterStatusDto: UpdateCenterStatusDto,
  ): Promise<UpdateResult> {
    const result = await CenterRepository.update(id, {
      ...updateCenterStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Center not found');
  }
}
