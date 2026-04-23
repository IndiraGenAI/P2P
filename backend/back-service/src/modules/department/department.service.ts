import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Department } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { GetDepartmentFilterDto } from './dto/department-filter.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { UpdateDepartmentStatusDto } from './dto/update-status.dto';
import { DepartmentRepository } from './department.repository';

interface DepartmentListResponse {
  rows: Department[];
  count: number;
}

@Injectable()
export class DepartmentService {
  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
    userEmailId: string | null,
  ): Promise<Department> {
    const name = createDepartmentDto.name?.trim();
    const code = createDepartmentDto.code?.trim();
    if (!name) {
      throw new ConflictException('Department name is required');
    }
    if (!code) {
      throw new ConflictException('Department code is required');
    }

    const existing = await DepartmentRepository.createQueryBuilder('department')
      .where('LOWER(department.name) = LOWER(:name)', { name })
      .orWhere('LOWER(department.code) = LOWER(:code)', { code })
      .getOne();
    if (existing) {
      const dupField =
        existing.name?.toLowerCase() === name.toLowerCase() ? 'name' : 'code';
      throw new ConflictException(
        `Department ${dupField} "${dupField === 'name' ? name : code}" already exists`,
      );
    }

    const department = DepartmentRepository.create({
      ...createDepartmentDto,
      name,
      code,
      status: createDepartmentDto.status ?? true,
      created_by: userEmailId ?? createDepartmentDto.created_by ?? null,
      created_date: new Date(),
    });

    return DepartmentRepository.save(department);
  }

  async findAllWithFilter(
    filterDto: GetDepartmentFilterDto,
  ): Promise<PageDto<Department> | DepartmentListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = DepartmentRepository.createQueryBuilder('department');

    if (name) {
      query.andWhere(
        '(LOWER(department.name) LIKE LOWER(:name) OR LOWER(department.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (status !== undefined && status !== null) {
      query.andWhere('department.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`department.${sortColumn}`, order);

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

  async findOne(id: number): Promise<Department> {
    const department = await DepartmentRepository.findOne({ where: { id } });
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return department;
  }

  async updateDepartment(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
    userEmailId: string | null,
  ): Promise<Department> {
    const department = await DepartmentRepository.findOne({ where: { id } });
    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const nextName = updateDepartmentDto.name?.trim() ?? department.name;
    const nextCode = updateDepartmentDto.code?.trim() ?? department.code;

    if (nextName !== department.name || nextCode !== department.code) {
      const conflict = await DepartmentRepository.createQueryBuilder('department')
        .where(
          '(LOWER(department.name) = LOWER(:name) OR LOWER(department.code) = LOWER(:code))',
          { name: nextName, code: nextCode },
        )
        .andWhere('department.id != :id', { id })
        .getOne();
      if (conflict) {
        const dupField =
          conflict.name?.toLowerCase() === nextName.toLowerCase()
            ? 'name'
            : 'code';
        throw new ConflictException(
          `Department ${dupField} "${dupField === 'name' ? nextName : nextCode}" already exists`,
        );
      }
    }

    if (updateDepartmentDto.name !== undefined) department.name = nextName;
    if (updateDepartmentDto.code !== undefined) department.code = nextCode;
    if (updateDepartmentDto.status !== undefined) {
      department.status = updateDepartmentDto.status;
    }

    department.updated_by = userEmailId ?? updateDepartmentDto.updated_by ?? null;
    department.updated_date = new Date();

    return DepartmentRepository.save(department);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await DepartmentRepository.delete({ id });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Department not found');
  }

  async updateDepartmentStatus(
    id: number,
    updateDepartmentStatusDto: UpdateDepartmentStatusDto,
  ): Promise<UpdateResult> {
    const result = await DepartmentRepository.update(id, {
      ...updateDepartmentStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Department not found');
  }
}
