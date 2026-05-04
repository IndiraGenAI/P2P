import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Subdepartment } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateSubdepartmentDto } from './dto/create-subdepartment.dto';
import { GetSubdepartmentFilterDto } from './dto/subdepartment-filter.dto';
import { UpdateSubdepartmentDto } from './dto/update-subdepartment.dto';
import { UpdateSubdepartmentStatusDto } from './dto/update-status.dto';
import { subdepartmentRepository } from './repository/subdepartment.repository';

interface SubdepartmentListResponse {
  rows: Subdepartment[];
  count: number;
}

@Injectable()
export class SubdepartmentService {
  async create(
    createSubdepartmentDto: CreateSubdepartmentDto,
    userEmailId: string | null,
  ): Promise<Subdepartment> {
    const name = createSubdepartmentDto.name?.trim();
    const code = createSubdepartmentDto.code?.trim();
    if (!createSubdepartmentDto.department_id) {
      throw new ConflictException('Department is required');
    }
    if (!name) {
      throw new ConflictException('Subdepartment name is required');
    }
    if (!code) {
      throw new ConflictException('Subdepartment code is required');
    }

    const codeConflict = await subdepartmentRepository.createQueryBuilder('subdepartment')
      .where('LOWER(subdepartment.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(
        `Subdepartment code "${code}" already exists`,
      );
    }

    const nameConflict = await subdepartmentRepository.createQueryBuilder('subdepartment')
      .where('LOWER(subdepartment.name) = LOWER(:name)', { name })
      .andWhere('subdepartment.department_id = :department_id', {
        department_id: createSubdepartmentDto.department_id,
      })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(
        `Subdepartment "${name}" already exists for this department`,
      );
    }

    const subdepartment = subdepartmentRepository.create({
      ...createSubdepartmentDto,
      name,
      code,
      status: createSubdepartmentDto.status ?? true,
      created_by: userEmailId ?? createSubdepartmentDto.created_by ?? null,
    });

    return subdepartmentRepository.save(subdepartment);
  }

  async findAll(
    filterDto: GetSubdepartmentFilterDto,
  ): Promise<PageDto<Subdepartment> | SubdepartmentListResponse> {
    const { name, department_id, status, orderBy, order } = filterDto;

    const query = subdepartmentRepository.createQueryBuilder('subdepartment')
      .leftJoin('subdepartment.department', 'department')
      .select([
        'subdepartment.id',
        'subdepartment.name',
        'subdepartment.code',
        'subdepartment.department_id',
        'subdepartment.status',
        'subdepartment.created_date',
        'subdepartment.updated_date',
        'department.id',
        'department.name',
      ]);

    if (name) {
      query.andWhere(
        '(LOWER(subdepartment.name) LIKE LOWER(:name) OR LOWER(subdepartment.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (department_id) {
      query.andWhere('subdepartment.department_id = :department_id', { department_id });
    }

    if (status !== undefined && status !== null) {
      query.andWhere('subdepartment.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`subdepartment.${sortColumn}`, order);

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

  async findOne(id: number): Promise<Subdepartment> {
    const subdepartment = await subdepartmentRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        code: true,
        department_id: true,
        status: true,
        department: { id: true, name: true },
      },
      relations: { department: true },
    });
    if (!subdepartment) {
      throw new NotFoundException('Subdepartment not found');
    }
    return subdepartment;
  }

  async update(
    id: number,
    updateSubdepartmentDto: UpdateSubdepartmentDto,
    userEmailId: string | null,
  ): Promise<Subdepartment> {
    const subdepartment = await subdepartmentRepository.findOne({ where: { id } });
    if (!subdepartment) {
      throw new NotFoundException('Subdepartment not found');
    }

    const nextName = updateSubdepartmentDto.name?.trim() ?? subdepartment.name;
    const nextCode = updateSubdepartmentDto.code?.trim() ?? subdepartment.code;
    const nextDepartmentId =
      updateSubdepartmentDto.department_id ?? subdepartment.department_id;

    if (nextCode !== subdepartment.code) {
      const codeConflict = await subdepartmentRepository.createQueryBuilder(
        'subdepartment',
      )
        .where('LOWER(subdepartment.code) = LOWER(:code)', { code: nextCode })
        .andWhere('subdepartment.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `Subdepartment code "${nextCode}" already exists`,
        );
      }
    }

    if (nextName !== subdepartment.name || nextDepartmentId !== subdepartment.department_id) {
      const nameConflict = await subdepartmentRepository.createQueryBuilder(
        'subdepartment',
      )
        .where('LOWER(subdepartment.name) = LOWER(:name)', { name: nextName })
        .andWhere('subdepartment.department_id = :department_id', {
          department_id: nextDepartmentId,
        })
        .andWhere('subdepartment.id != :id', { id })
        .getOne();
      if (nameConflict) {
        throw new ConflictException(
          `Subdepartment "${nextName}" already exists for this department`,
        );
      }
    }

    if (updateSubdepartmentDto.name !== undefined) subdepartment.name = nextName;
    if (updateSubdepartmentDto.code !== undefined) subdepartment.code = nextCode;
    if (updateSubdepartmentDto.department_id !== undefined) {
      subdepartment.department_id = nextDepartmentId;
    }
    if (updateSubdepartmentDto.status !== undefined) {
      subdepartment.status = updateSubdepartmentDto.status;
    }

    subdepartment.updated_by = userEmailId ?? updateSubdepartmentDto.updated_by ?? null;

    return subdepartmentRepository.save(subdepartment);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await subdepartmentRepository.delete({ id });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Subdepartment not found');
  }

  async updateStatus(
    id: number,
    updateSubdepartmentStatusDto: UpdateSubdepartmentStatusDto,
  ): Promise<UpdateResult> {
    const result = await subdepartmentRepository.update(id, {
      ...updateSubdepartmentStatusDto,
    });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Subdepartment not found');
  }
}
