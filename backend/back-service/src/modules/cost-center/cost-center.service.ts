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
import { costCenterRepository } from './repository/cost-center.repository';

interface CostCenterListResponse {
  rows: CostCenter[];
  count: number;
}

@Injectable()
export class CostCenterService {
  async create(
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

    const codeConflict = await costCenterRepository.createQueryBuilder('cost_center')
      .where('LOWER(cost_center.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(
        `Cost center code "${code}" already exists`,
      );
    }

    const costCenter = costCenterRepository.create({
      ...createCostCenterDto,
      code,
      name,
      status: createCostCenterDto.status ?? true,
      created_by: userEmailId ?? createCostCenterDto.created_by ?? null,
      created_date: new Date(),
    });

    return costCenterRepository.save(costCenter);
  }

  async findAll(
    filterDto: GetCostCenterFilterDto,
  ): Promise<PageDto<CostCenter> | CostCenterListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = costCenterRepository.createQueryBuilder('cost_center').select([
      'cost_center.id',
      'cost_center.name',
      'cost_center.code',
      'cost_center.status',
      'cost_center.created_date',
      'cost_center.updated_date',
    ]);

    if (name) {
      query.andWhere(
        '(LOWER(cost_center.name) LIKE LOWER(:name) OR LOWER(cost_center.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (status !== undefined && status !== null) {
      query.andWhere('cost_center.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`cost_center.${sortColumn}`, order);

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
    const costCenter = await costCenterRepository.findOne({
      where: { id },
      select: ['id', 'name', 'code', 'status'],
    });
    if (!costCenter) {
      throw new NotFoundException('Cost center not found');
    }
    return costCenter;
  }

  async update(
    id: number,
    updateCostCenterDto: UpdateCostCenterDto,
    userEmailId: string | null,
  ): Promise<CostCenter> {
    const costCenter = await costCenterRepository.findOne({ where: { id } });
    if (!costCenter) {
      throw new NotFoundException('Cost center not found');
    }

    const nextCode = updateCostCenterDto.code?.trim() ?? costCenter.code;
    const nextName = updateCostCenterDto.name?.trim() ?? costCenter.name;

    if (nextCode !== costCenter.code) {
      const codeConflict = await costCenterRepository.createQueryBuilder('cost_center')
        .where('LOWER(cost_center.code) = LOWER(:code)', { code: nextCode })
        .andWhere('cost_center.id != :id', { id })
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

    return costCenterRepository.save(costCenter);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await costCenterRepository.delete({ id });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Cost center not found');
  }

  async updateStatus(
    id: number,
    updateCostCenterStatusDto: UpdateCostCenterStatusDto,
  ): Promise<UpdateResult> {
    const result = await costCenterRepository.update(id, {
      ...updateCostCenterStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Cost center not found');
  }
}
