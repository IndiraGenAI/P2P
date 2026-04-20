import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Branches, Departments } from 'erp-db';
import { DepartmentsRepository } from './departments.repository';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { GetDepartmentFilterDto } from './dto/department-filter.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PageDto } from 'src/general-dto/.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/-option.dto';
import { UpdateDepartmentStatusDto } from './dto/update-status.dto';
import { DepartmentResponse } from './dto/interface.dto';
import { branchDepartementRepository } from './branchdepartement.repository';
import { GetSortOrder } from '@commons/helper';

@Injectable()
export class DepartmentsService {
  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
    userEmailId: string | null,
  ): Promise<number | undefined> {
    const { branch_departments, ...createDepartmentsDto } = createDepartmentDto;
    if (userEmailId) {
      createDepartmentsDto.created_by = userEmailId;
      branch_departments.map((x) => {
        x.created_by = userEmailId;
      });
    }
    const result = await DepartmentsRepository.createOrUpdateDepartment(
      createDepartmentsDto,
      branch_departments,
    );
    return result;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Departments>> {
    const query = await DepartmentsRepository.createQueryBuilder('departments');

    query
      .orderBy('departments.createdDate', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await query.getCount();
    const { entities } = await query.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getDepartmentWithFilter(
    filterDto: GetDepartmentFilterDto,
  ): Promise<PageDto<Departments> | DepartmentResponse> {
    const { isZoneOnly, status, name, code, branch_ids, branchIds } = filterDto;
    let query = await DepartmentsRepository.createQueryBuilder('departments')
      .leftJoinAndSelect('departments.branch_departments', 'branch_departments')
      .leftJoinAndSelect('branch_departments.branch', 'branch')
      .leftJoinAndSelect('branch.zone', 'zone');

    if (String(filterDto.isZoneOnly) == 'true' && branchIds instanceof Array) {
      query.andWhere(
        `branch_departments.branch_id IN(${
          branchIds.length > 0 ? branchIds : null
        })`,
      );
    }

    if (branch_ids) {
      if (branch_ids instanceof Array) {
        let branch_id = [];
        for (let i = 0; i < branch_ids.length; i++) {
          branch_id.push(Number(branch_ids[i]));
        }
        query.andWhere(`branch_departments.branch_id IN(${branch_id})`);
      } else {
        query.andWhere('branch_departments.branch_id = :branch_id', {
          branch_id: branch_ids,
        });
      }
    }

    if (name) {
      query.andWhere(`LOWER(departments.name) LIKE LOWER(:name)`, {
        name: `%${name}%`,
      });
    }
    if (code) {
      query.andWhere(`LOWER(departments.code) LIKE LOWER(:code)`, {
        code: `%${code}%`,
      });
    }
    if (status) {
      query.andWhere('departments.status = :status', { status });
    }
    if (filterDto.orderBy) {
      query.orderBy(`departments.${filterDto.orderBy}`, filterDto.order);
    } else {
      query.orderBy(`departments.created_date`, filterDto.order);
    }
    if (String(filterDto.noLimit) === 'true') {
      let data = await query.getManyAndCount();
      const result = {
        rows: data[0],
        count: data[0].length,
      };
      return result;
    } else {
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
      entities.map((x) => {
        x.branch_departments.sort(GetSortOrder('id', 'ASC'));
      });
      return new PageDto(entities, pageMetaDto);
    }
  }

  async findOne(id: number): Promise<Departments> {
    const result = await DepartmentsRepository.find({ where: { id } });
    if (!result[0]) {
      throw new NotFoundException('This record does not exist!');
    }
    return result[0];
  }

  async updateDepartment(
    data: UpdateDepartmentDto,
    userEmailId: string | null,
  ): Promise<number | undefined> {
    const { branch_departments, ...createPackageDto } = data;
    let res;
    let record;
    if (userEmailId) {
      createPackageDto.updated_by = userEmailId;
      branch_departments.map((x) => {
        if (x.id === undefined) {
          x.created_by = userEmailId;
        } else {
          x.updated_by = userEmailId;
        }
      });
    }
    for (let i = 0; i < branch_departments.length; i++) {
      record = branch_departments[i];
      res = await branchDepartementRepository.find({
        where: {
          id: record.id,
        },
      });
      if (!res[0]) {
        throw new NotFoundException(
          `This record branch_departements id ${record.id} does not exist!`,
        );
      }
    }

    let branchDepartmentId;
    let branchDepartmentRes;
    for (let j = 0; j < branch_departments.length; j++) {
      branchDepartmentId = branch_departments[j];
      if (branchDepartmentId != undefined) {
        if (Object.keys(branchDepartmentId).length === 1) {
          if (
            branchDepartmentId?.branch_id === branchDepartmentRes?.branch_id
          ) {
            throw new ConflictException(
              `This branch_id ${branchDepartmentId.branch_id} already assigned`,
            );
          }
        }

        branchDepartmentRes = await branchDepartementRepository.find({
          where: {
            id: branchDepartmentId.id,
            branch_id: branchDepartmentId.branch_id,
          },
        });
      }
    }
    const result = await DepartmentsRepository.createOrUpdateDepartment(
      createPackageDto,
      branch_departments,
    );
    if (!result) {
      throw new NotFoundException('This record does not exist!');
    }

    return result;
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await DepartmentsRepository.delete({ id });
    if (result && result.affected > 0) {
      return result;
    } else {
      throw new NotFoundException('This record does not exist!');
    }
  }

  async updateDepartmentStatus(
    id: number,
    updateDepartmentStatusDto: UpdateDepartmentStatusDto,
  ): Promise<UpdateResult> {
    const result = await DepartmentsRepository.update(
      id,
      updateDepartmentStatusDto,
    );
    if (result && result.affected > 0) {
      return result;
    } else {
      throw new NotFoundException('This record does not exist!');
    }
  }
}
