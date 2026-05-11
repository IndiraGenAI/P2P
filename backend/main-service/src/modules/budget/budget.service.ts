import { dataSource } from '@core/data-source';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Budget, Subdepartment } from 'erp-db';
import { QueryFailedError } from 'typeorm';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { GetBudgetFilterDto } from './dto/get-budget-filter.dto';
import { budgetRepository } from './repository/budget.repository';

const RELATIONS = {
  coa: true,
  department: true,
  subdepartment: true,
  entity: true,
  center: true,
  cost_center: true,
} as const;

@Injectable()
export class BudgetService {
  private async assertSubdepartmentMatchesDepartment(
    subdepartmentId: number,
    departmentId: number,
  ): Promise<void> {
    const sub = await dataSource.getRepository(Subdepartment).findOne({
      where: { id: subdepartmentId },
    });
    if (!sub) {
      throw new NotFoundException(`Subdepartment id=${subdepartmentId} not found`);
    }
    if (sub.department_id !== departmentId) {
      throw new BadRequestException(
        'Subdepartment does not belong to the selected department.',
      );
    }
  }

  async create(dto: CreateBudgetDto, userEmail: string | undefined): Promise<Budget> {
    await this.assertSubdepartmentMatchesDepartment(
      dto.subdepartment_id,
      dto.department_id,
    );
    const row = budgetRepository.create({
      financial_year: dto.financial_year.trim(),
      budget_type: dto.budget_type,
      coa_id: dto.coa_id,
      department_id: dto.department_id,
      subdepartment_id: dto.subdepartment_id,
      entity_id: dto.entity_id,
      center_id: dto.center_id,
      cost_center_id: dto.cost_center_id,
      amount: String(dto.amount),
      consumed_amount: '0',
      balance_amount: String(dto.amount),
      control_type: dto.control_type,
      created_by: userEmail ?? null,
      updated_by: userEmail ?? null,
    });
    try {
      const saved = await budgetRepository.save(row);
      return this.findOne(saved.id);
    } catch (e) {
      if (
        e instanceof QueryFailedError &&
        String((e as QueryFailedError).driverError?.code) === '23505'
      ) {
        throw new ConflictException(
          'A budget already exists for this scope (financial year, type, COA, org keys).',
        );
      }
      throw e;
    }
  }

  async findAll(
    filter: GetBudgetFilterDto,
  ): Promise<PageDto<Budget> | { rows: Budget[]; count: number }> {
    const {
      search,
      financial_year,
      budget_type,
      department_id,
      entity_id,
      orderBy,
      order,
    } = filter;

    const qb = budgetRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.coa', 'coa')
      .leftJoinAndSelect('b.department', 'department')
      .leftJoinAndSelect('b.subdepartment', 'subdepartment')
      .leftJoinAndSelect('b.entity', 'ent')
      .leftJoinAndSelect('b.center', 'center')
      .leftJoinAndSelect('b.cost_center', 'cost_center');

    if (financial_year?.trim()) {
      qb.andWhere('b.financial_year = :fy', {
        fy: financial_year.trim(),
      });
    }
    if (budget_type) {
      qb.andWhere('b.budget_type = :bt', { bt: budget_type });
    }
    if (department_id) {
      qb.andWhere('b.department_id = :departmentId', {
        departmentId: department_id,
      });
    }
    if (entity_id) {
      qb.andWhere('b.entity_id = :entityId', { entityId: entity_id });
    }
    if (search?.trim()) {
      qb.andWhere(
        '(LOWER(coa.gl_code) LIKE LOWER(:q) OR LOWER(coa.gl_name) LIKE LOWER(:q))',
        { q: `%${search.trim()}%` },
      );
    }

    const sortColumn = orderBy ?? 'created_date';
    qb.orderBy(`b.${sortColumn}`, order ?? 'DESC');

    if (String(filter.noLimit) === 'true') {
      const [rows, count] = await qb.getManyAndCount();
      return { rows, count };
    }

    const itemCount = await qb.clone().getCount();
    qb.skip(filter.skip ?? 0).take(filter.take ?? 20);
    const rows = await qb.getMany();

    const pageOptionsDto: PageOptionsDto = {
      take: filter.take,
      createdDate: new Date(),
      order: filter.order,
      skip: filter.skip,
    } as PageOptionsDto;
    const meta = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(rows as Budget[], meta);
  }

  async findOne(id: number): Promise<Budget> {
    const row = await budgetRepository.findOne({
      where: { id },
      relations: { ...RELATIONS },
    });
    if (!row) {
      throw new NotFoundException(`Budget id=${id} not found`);
    }
    return row;
  }
}
