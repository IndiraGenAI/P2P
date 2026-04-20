import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import {
  Branches,
  Course,
  Lookups,
  Packages,
  Subcourses,
  BranchDepartments,
} from 'erp-db';
import {
  branchCourseRepository,
  branchDdepartmentsRepository,
  packageBranchesRepository,
  packageRepository,
  packageSubCoursesRepository,
} from './package.repository';
import { UpdatePackageStatusDto } from './dto/update-package-status.dto';
import { UpdateResult } from 'typeorm';
import { GetPackageFilterDto } from './dto/filter-package.dto';
import { PageDto } from 'src/general-dto/.dto';
import { PackagesResponse } from './dto/package.interface';
import { PageOptionsDto } from 'src/general-dto/-option.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { packageFeesReposirtory } from './package-fees.repsoitory';
import {
  BranchCourseResponse,
  GetMultipleBranchWiseCommonCourse,
} from './dto/branch-department-course.dto';
import { ConflictException } from '@nestjs/common/exceptions';
import { GetSortOrder } from '@commons/helper';
import { FeeTypes } from '@commons/enum';

@Injectable()
export class PackagesService {
  async createPackages(
    createPackagesDto: CreatePackageDto,
    userEmailId: string | null,
  ): Promise<number | undefined> {
    const {
      courseConfig,
      package_fees,
      package_subcourses,
      package_branches,
      ...createPackageDto
    } = createPackagesDto;
    if (userEmailId) {
      createPackageDto.created_by = userEmailId;
      package_fees.map((x) => {
        x.created_by = userEmailId;
      });
      package_subcourses.map((x) => {
        x.created_by = userEmailId;
      });
      package_branches.map((x) => {
        x.created_by = userEmailId;
      });
    }
    let packageFeesRecord = package_fees.map(
      (packageFees) => packageFees.fee_type_id,
    );
    let packageFees = [];
    for (let i = 0; i < packageFeesRecord.length; i++) {
      const element = packageFeesRecord[i];
      if (packageFees.includes(packageFeesRecord[i])) {
        throw new ConflictException(
          `This ${
            element === 1
              ? FeeTypes.REGISTRATION
              : element === 2
              ? FeeTypes.MATERIAL
              : FeeTypes.TUITION
          } Fees already assigned`,
        );
      } else {
        packageFees.push(packageFeesRecord[i]);
      }
    }

    let packageSubcourseId = package_subcourses.map((ps) => ps.subcourse_id);
    let data = [];
    for (let i = 0; i < packageSubcourseId.length; i++) {
      if (data.includes(packageSubcourseId[i])) {
        throw new ConflictException(`This subcourse already exist!`);
      } else {
        data.push(packageSubcourseId[i]);
      }
    }
    const result = await packageRepository.createOrUpdatePackage(
      courseConfig,
      createPackageDto,
      package_fees,
      package_subcourses,
      package_branches,
    );
    return result;
  }

  async getPackageWithFilter(
    filterDto: GetPackageFilterDto,
  ): Promise<PageDto<Packages> | PackagesResponse> {
    const {
      branchIds,
      branch_ids,
      department_id,
      subdepartment_id,
      name,
      code,
      is_job_guarantee,
      total,
      duration,
      installment,
      status,
    } = filterDto;
    let query = await packageRepository
      .createQueryBuilder('packages')
      .leftJoinAndSelect('packages.department', 'department')
      .leftJoinAndSelect('packages.subdepartment', 'subdepartment')
      .leftJoinAndSelect('packages.courseConfig', 'courseConfig')
      .leftJoinAndSelect('packages.package_fees', 'package_fees')
      .leftJoinAndMapMany(
        'package_fees.lookups',
        Lookups,
        'lookups',
        'package_fees.fee_type_id = lookups.id',
      )
      .leftJoinAndSelect('packages.package_subcourses', 'package_subcourses')
      .leftJoinAndMapMany(
        'package_subcourses.subcourses',
        Subcourses,
        'subcourses',
        'package_subcourses.subcourse_id = subcourses.id',
      )
      .leftJoinAndSelect('packages.package_branches', 'package_branches')
      .leftJoinAndMapMany(
        'package_branches.branches',
        Branches,
        'branches',
        'package_branches.branch_id = branches.id',
      )
      .leftJoinAndMapMany(
        'subcourses.course',
        Course,
        'course',
        'subcourses.course_id = course.id',
      )
      .orderBy('package_branches.id', 'ASC');

    if (
      String(filterDto.isZoneOnly) == 'true' &&
      branchIds instanceof Array &&
      branchIds.length > 0
    ) {
      query.andWhere(`branches.id IN(${filterDto.branchIds})`);
    }
    if (branch_ids) {
      if (branch_ids instanceof Array) {
        let branch_id = [];
        for (let i = 0; i < branch_ids.length; i++) {
          branch_id.push(Number(branch_ids[i]));
        }
        query.andWhere(`package_branches.branch_id IN(${branch_id})`);
      } else {
        query.andWhere('package_branches.branch_id = :branch_id', {
          branch_id: branch_ids,
        });
      }
    }

    if (department_id) {
      query.andWhere('packages.department_id = :department_id', {
        department_id,
      });
    }
    if (subdepartment_id) {
      query.andWhere('packages.subdepartment_id = :subdepartment_id', {
        subdepartment_id,
      });
    }
    if (name) {
      query.andWhere(`LOWER(packages.name) LIKE LOWER(:name)`, {
        name: `%${name}%`,
      });
    }
    if (code) {
      query.andWhere(`LOWER(packages.code) LIKE LOWER(:code)`, {
        code: `%${code}%`,
      });
    }
    if (is_job_guarantee) {
      query.andWhere('packages.is_job_guarantee = :is_job_guarantee', {
        is_job_guarantee,
      });
    }
    if (total) {
      query.andWhere(`packages.total = :total `, { total: `${total}` });
    }
    if (duration) {
      query.andWhere(`packages.duration = :duration `, {
        duration: `${duration}`,
      });
    }
    if (installment) {
      query.andWhere(`packages.installment = :installment `, {
        installment: `${installment}`,
      });
    }
    if (status) {
      query.andWhere('packages.status = :status', { status });
    }
    if (filterDto.orderBy) {
      query.orderBy(`packages.${filterDto.orderBy}`, filterDto.order);
    } else {
      query.orderBy(`packages.created_date`, filterDto.order);
    }
    if (String(filterDto.noLimit) == 'true') {
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
        createdDate: filterDto.createdDate,
        order: filterDto.order,
        skip: filterDto.skip,
      } as PageOptionsDto;
      entities.map((x) => {
        x.package_branches.sort(GetSortOrder('id', 'ASC'));
      });
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(entities, pageMetaDto);
    }
  }

  async findOne(id: number): Promise<Packages> {
    const result = await packageRepository.find({ where: { id } });
    if (!result[0]) {
      throw new NotFoundException('This record does not exist!');
    }
    return result[0];
  }

  update(id: number, updatePackageDto: UpdatePackageDto) {
    return `This action updates a #${id} package`;
  }

  async remove(id: number) {
    const result = await packageRepository.delete(id);
    if (result && result.affected > 0) {
      return result;
    } else {
      throw new NotFoundException('This record does not exist!');
    }
  }

  async updatePackageStatus(
    id: number,
    updatePackageStatusDto: UpdatePackageStatusDto,
  ): Promise<UpdateResult> {
    const result = await packageRepository.update(id, updatePackageStatusDto);
    if (result && result.affected > 0) {
      return result;
    } else {
      throw new NotFoundException('This record does not exist!');
    }
  }

  async updatePackage(
    updatePackageDto: UpdatePackageDto,
    userEmailId: string | null,
  ): Promise<number | undefined> {
    const {
      courseConfig,
      package_fees,
      package_subcourses,
      package_branches,
      ...UpdatePackageDto
    } = updatePackageDto;
    let record;
    let res;
    let packageSubcourses;
    let element;
    let packageBranchesResult;
    if (userEmailId) {
      UpdatePackageDto.updated_by = userEmailId;
      package_fees.map((x) => {
        if (x.id === undefined) {
          x.created_by = userEmailId;
        } else {
          x.updated_by = userEmailId;
        }
      });
      package_subcourses.map((x) => {
        if (x.id === undefined) {
          x.created_by = userEmailId;
        } else {
          x.updated_by = userEmailId;
        }
      });
      package_branches.map((x) => {
        if (x.id === undefined) {
          x.created_by = userEmailId;
        } else {
          x.updated_by = userEmailId;
        }
      });
    }

    let packageFees = [];
    for (let o = 0; o < package_fees.length; o++) {
      const value = package_fees[o];
      if (!packageFees.includes(value.fee_type_id)) {
        packageFees.push(value.fee_type_id);
      } else {
        throw new ConflictException(
          `This ${
            value.fee_type_id === 1
              ? FeeTypes.REGISTRATION
              : value.fee_type_id === 2
              ? FeeTypes.MATERIAL
              : FeeTypes.TUITION
          } Fees already assigned`,
        );
      }
    }

    for (let i = 0; i < package_fees.length; i++) {
      record = package_fees[i];
      res = await packageFeesReposirtory.find({
        where: {
          id: record.id,
          fee_type_id: record.fee_type_id,
        },
      });
    }
    if (!res) {
      throw new NotFoundException(
        `This record package_fees id ${record.id} does not exist.`,
      );
    }

    for (let k = 0; k < package_fees.length; k++) {
      const element = package_fees[k];
      let record = await packageFeesReposirtory.find({
        where: {
          package_id: updatePackageDto.id,
          fee_type_id: element.fee_type_id,
          id: element.id,
        },
      });
      if (Object.keys(element).length === 2) {
        if (element?.fee_type_id == record[0]?.fee_type_id) {
          throw new NotFoundException(
            `This fee_type_id ${element.fee_type_id} already assinged!`,
          );
        }
      }
    }
    package_subcourses.map(async (x) => {
      const data = await packageSubCoursesRepository.find({
        where: { id: x.id },
      });
      if (!data) {
        throw new ConflictException(
          `This subcourse_id ${packageSubcourses.subcourse_id} already exist!`,
        );
      }
    });
    let packageSubcourseId = package_subcourses.map((ps) => ps.subcourse_id);
    let data = [];
    for (let i = 0; i < packageSubcourseId.length; i++) {
      if (data.includes(packageSubcourseId[i])) {
        throw new ConflictException(`This subcourse already exist!`);
      } else {
        data.push(packageSubcourseId[i]);
      }
    }
    for (let k = 0; k < package_branches.length; k++) {
      element = package_branches[k];
      if (Object.keys(element).length === 1) {
        if (element?.branch_id === packageBranchesResult?.branch_id) {
          throw new ConflictException(
            `This branch_id ${element.branch_id} already exist!`,
          );
        }
      }
      packageBranchesResult = await packageBranchesRepository.find({
        where: {
          id: element.id,
        },
      });
    }
    if (!packageBranchesResult[0]) {
      throw new ConflictException(
        `This record package_subcourses id ${element.id} does not exist.`,
      );
    }
    const result = await packageRepository.createOrUpdatePackage(
      courseConfig,
      UpdatePackageDto,
      package_fees,
      package_subcourses,
      package_branches,
    );
    if (!result) {
      throw new NotFoundException('This record does not exist!');
    }
    return result;
  }

  async coursepackage(): Promise<[BranchDepartments[], number]> {
    const result = await branchDdepartmentsRepository.BranchDepartmentsInfo();
    return result;
  }

  async getBranchWiseCommonCourse(
    filterDto: GetMultipleBranchWiseCommonCourse,
  ): Promise<BranchCourseResponse> {
    const result = await branchCourseRepository.getBranchWiseCommonCourse(
      filterDto,
    );
    return result;
  }
}
