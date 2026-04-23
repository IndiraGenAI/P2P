import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CostCenter } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { GetCostCenterFilterDto } from './dto/cost-center-filter.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';
import { UpdateCostCenterStatusDto } from './dto/update-status.dto';
import { CostCenterRepository } from './cost-center.repository';

interface CostCenterListResponse {
  rows: CostCenter[];
  count: number;
}

@Injectable()
export class CostCenterService {
  async createCostCenter(
    createCostCenterDto: CreateCostCenterDto,
    userEmailId: string | null,
  ): Promise<CostCenter> {
    const code = createCostCenterDto.code?.trim();
    const name = createCostCenterDto.name?.trim();
    if (!code) {
      throw new ConflictException('Cost center code is required');
    }
    if (!name) {
      throw new ConflictException('Cost center name is required');
    }

    const codeConflict = await CostCenterRepository.createQueryBuilder('cc')
      .where('LOWER(cc.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(
        `Cost center code "${code}" already exists`,
      );
    }

    const costCenter = CostCenterRepository.create({
      ...createCostCenterDto,
      code,
      name,
      status: createCostCenterDto.status ?? true,
      created_by: userEmailId ?? createCostCenterDto.created_by ?? null,
      created_date: new Date(),
    });

    return CostCenterRepository.save(costCenter);
  }

  async findAllWithFilter(
    filterDto: GetCostCenterFilterDto,
  ): Promise<PageDto<CostCenter> | CostCenterListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = CostCenterRepository.createQueryBuilder('cc');

    if (name) {
      query.andWhere(
        '(LOWER(cc.name) LIKE LOWER(:name) OR LOWER(cc.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (status !== undefined && status !== null) {
      query.andWhere('cc.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`cc.${sortColumn}`, order);

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

  async findOne(id: number): Promise<CostCenter> {
    const costCenter = await CostCenterRepository.findOne({ where: { id } });
    if (!costCenter) {
      throw new NotFoundException('Cost center not found');
    }
    return costCenter;
  }

  async updateCostCenter(
    id: number,
    updateCostCenterDto: UpdateCostCenterDto,
    userEmailId: string | null,
  ): Promise<CostCenter> {
    const costCenter = await CostCenterRepository.findOne({ where: { id } });
    if (!costCenter) {
      throw new NotFoundException('Cost center not found');
    }

    const nextCode = updateCostCenterDto.code?.trim() ?? costCenter.code;
    const nextName = updateCostCenterDto.name?.trim() ?? costCenter.name;

    if (nextCode !== costCenter.code) {
      const codeConflict = await CostCenterRepository.createQueryBuilder('cc')
        .where('LOWER(cc.code) = LOWER(:code)', { code: nextCode })
        .andWhere('cc.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `Cost center code "${nextCode}" already exists`,
        );
      }
    }

    if (updateCostCenterDto.code !== undefined) costCenter.code = nextCode;
    if (updateCostCenterDto.name !== undefined) costCenter.name = nextName;
    if (updateCostCenterDto.status !== undefined) {
      costCenter.status = updateCostCenterDto.status;
    }

    costCenter.updated_by =
      userEmailId ?? updateCostCenterDto.updated_by ?? null;
    costCenter.updated_date = new Date();

    return CostCenterRepository.save(costCenter);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await CostCenterRepository.delete({ id });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Cost center not found');
  }

  async updateCostCenterStatus(
    id: number,
    updateCostCenterStatusDto: UpdateCostCenterStatusDto,
  ): Promise<UpdateResult> {
    const result = await CostCenterRepository.update(id, {
      ...updateCostCenterStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Cost center not found');
  }
}
