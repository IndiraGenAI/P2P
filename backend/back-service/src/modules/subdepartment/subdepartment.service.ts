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
import { SubdepartmentRepository } from './subdepartment.repository';

interface SubdepartmentListResponse {
  rows: Subdepartment[];
  count: number;
}

@Injectable()
export class SubdepartmentService {
  async createSubdepartment(
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

    const codeConflict = await SubdepartmentRepository.createQueryBuilder('sub')
      .where('LOWER(sub.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(
        `Subdepartment code "${code}" already exists`,
      );
    }

    const nameConflict = await SubdepartmentRepository.createQueryBuilder('sub')
      .where('LOWER(sub.name) = LOWER(:name)', { name })
      .andWhere('sub.department_id = :department_id', {
        department_id: createSubdepartmentDto.department_id,
      })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(
        `Subdepartment "${name}" already exists for this department`,
      );
    }

    const subdepartment = SubdepartmentRepository.create({
      ...createSubdepartmentDto,
      name,
      code,
      status: createSubdepartmentDto.status ?? true,
      created_by: userEmailId ?? createSubdepartmentDto.created_by ?? null,
      created_date: new Date(),
    });

    return SubdepartmentRepository.save(subdepartment);
  }

  async findAllWithFilter(
    filterDto: GetSubdepartmentFilterDto,
  ): Promise<PageDto<Subdepartment> | SubdepartmentListResponse> {
    const { name, department_id, status, orderBy, order } = filterDto;

    const query = SubdepartmentRepository.createQueryBuilder('sub')
      .leftJoinAndSelect('sub.department', 'department');

    if (name) {
      query.andWhere(
        '(LOWER(sub.name) LIKE LOWER(:name) OR LOWER(sub.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (department_id) {
      query.andWhere('sub.department_id = :department_id', { department_id });
    }

    if (status !== undefined && status !== null) {
      query.andWhere('sub.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`sub.${sortColumn}`, order);

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
    const sub = await SubdepartmentRepository.findOne({
      where: { id },
      relations: { department: true },
    });
    if (!sub) {
      throw new NotFoundException('Subdepartment not found');
    }
    return sub;
  }

  async updateSubdepartment(
    id: number,
    updateSubdepartmentDto: UpdateSubdepartmentDto,
    userEmailId: string | null,
  ): Promise<Subdepartment> {
    const sub = await SubdepartmentRepository.findOne({ where: { id } });
    if (!sub) {
      throw new NotFoundException('Subdepartment not found');
    }

    const nextName = updateSubdepartmentDto.name?.trim() ?? sub.name;
    const nextCode = updateSubdepartmentDto.code?.trim() ?? sub.code;
    const nextDepartmentId =
      updateSubdepartmentDto.department_id ?? sub.department_id;

    if (nextCode !== sub.code) {
      const codeConflict = await SubdepartmentRepository.createQueryBuilder(
        'sub',
      )
        .where('LOWER(sub.code) = LOWER(:code)', { code: nextCode })
        .andWhere('sub.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `Subdepartment code "${nextCode}" already exists`,
        );
      }
    }

    if (nextName !== sub.name || nextDepartmentId !== sub.department_id) {
      const nameConflict = await SubdepartmentRepository.createQueryBuilder(
        'sub',
      )
        .where('LOWER(sub.name) = LOWER(:name)', { name: nextName })
        .andWhere('sub.department_id = :department_id', {
          department_id: nextDepartmentId,
        })
        .andWhere('sub.id != :id', { id })
        .getOne();
      if (nameConflict) {
        throw new ConflictException(
          `Subdepartment "${nextName}" already exists for this department`,
        );
      }
    }

    if (updateSubdepartmentDto.name !== undefined) sub.name = nextName;
    if (updateSubdepartmentDto.code !== undefined) sub.code = nextCode;
    if (updateSubdepartmentDto.department_id !== undefined) {
      sub.department_id = nextDepartmentId;
    }
    if (updateSubdepartmentDto.status !== undefined) {
      sub.status = updateSubdepartmentDto.status;
    }

    sub.updated_by = userEmailId ?? updateSubdepartmentDto.updated_by ?? null;
    sub.updated_date = new Date();

    return SubdepartmentRepository.save(sub);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await SubdepartmentRepository.delete({ id });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Subdepartment not found');
  }

  async updateSubdepartmentStatus(
    id: number,
    updateSubdepartmentStatusDto: UpdateSubdepartmentStatusDto,
  ): Promise<UpdateResult> {
    const result = await SubdepartmentRepository.update(id, {
      ...updateSubdepartmentStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Subdepartment not found');
  }
}
