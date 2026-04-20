import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Course } from 'erp-db';
import { UpdateResult } from 'typeorm';
import { courseRepository } from './course.respository';
import { CreateCourseDto } from './dto/create-course.dto';
import { GetCourseFilterDto } from './dto/filter-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateCourseStatusDto } from './dto/update-status.dto';
import { CourseResponse } from './dto/course.interface';
import { branchesCourseRepository } from './branch-courses.repository';
import { PageOptionsDto } from 'src/general-dto/-option.dto';
import { PageDto } from 'src/general-dto/.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { GetSortOrder } from '@commons/helper';

@Injectable()
export class CourseService {
  async createCourse(
    createCourseDto: CreateCourseDto,
    userEmailId: string | null,
  ): Promise<number | undefined> {
    const { branch_courses, ...createCoursesDto } = createCourseDto;
    if (userEmailId) {
      createCoursesDto.created_by = userEmailId;
      branch_courses.map((x) => {
        x.created_by = userEmailId;
      });
    }
    const result = await courseRepository.createOrUpdateCourse(
      createCoursesDto,
      branch_courses,
    );
    return result;
  }

  async getCourseWithFilter(
    filterDto: GetCourseFilterDto,
  ): Promise<PageDto<Course> | CourseResponse> {
    const {
      branchIds,
      department_id,
      subdepartment_id,
      status,
      name,
      code,
      branch_ids,
    } = filterDto;
    let query = await courseRepository
      .createQueryBuilder('courses')
      .leftJoinAndSelect('courses.department', 'department')
      .leftJoinAndSelect('courses.subdepartment', 'subdepartment')
      .leftJoinAndSelect('courses.branch_courses', 'branch_courses')
      .leftJoinAndSelect('branch_courses.branch', 'branch');

    if (
      String(filterDto.isZoneOnly) == 'true' &&
      branchIds instanceof Array &&
      branchIds.length > 0
    ) {
      query.andWhere(`branch.id IN(${filterDto.branchIds})`);
    }
    if (branch_ids) {
      if (branch_ids instanceof Array) {
        let branch_id = [];
        for (let i = 0; i < branch_ids.length; i++) {
          branch_id.push(Number(branch_ids[i]));
        }
        query.andWhere(`branch_courses.branch_id IN(${branch_id})`);
      } else {
        query.andWhere('branch_courses.branch_id = :branch_id', {
          branch_id: branch_ids,
        });
      }
    }

    if (department_id) {
      query.andWhere('courses.department_id = :department_id', {
        department_id,
      });
    }

    if (subdepartment_id) {
      query.andWhere('courses.subdepartment_id = :subdepartment_id', {
        subdepartment_id,
      });
    }

    if (name) {
      query.andWhere(`LOWER(courses.name) LIKE LOWER(:name)`, {
        name: `%${name}%`,
      });
    }
    if (code) {
      query.andWhere(`LOWER(courses.code) LIKE LOWER(:code)`, {
        code: `%${code}%`,
      });
    }
    if (status) {
      query.andWhere('courses.status = :status', { status });
    }
    if (filterDto.orderBy) {
      query.orderBy(`courses.${filterDto.orderBy}`, filterDto.order);
    } else {
      query.orderBy(`courses.created_date`, filterDto.order);
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
      entities.map((rec) => {
        rec.branch_courses.sort(GetSortOrder('id', 'ASC'));
      });
      const pageOptionsDto: PageOptionsDto = {
        take: filterDto.take,
        createdDate: new Date(),
        order: filterDto.order,
        skip: filterDto.skip,
      } as PageOptionsDto;

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(entities, pageMetaDto);
    }
  }

  async findOne(id: number): Promise<Course> {
    const result = await courseRepository.find({ where: { id } });
    if (!result[0]) {
      throw new NotFoundException('This record does not exist!');
    }
    return result[0];
  }

  async updateCourse(
    updateCourseDto: UpdateCourseDto,
    userEmailId: string | null,
  ): Promise<number | undefined> {
    const { branch_courses, ...updateCoursesDto } = updateCourseDto;
    let record;
    let res;
    if (userEmailId) {
      updateCoursesDto.updated_by = userEmailId;
      branch_courses.map((x) => {
        if (x.id === undefined) {
          x.created_by = userEmailId;
        } else {
          x.updated_by = userEmailId;
        }
      });
    }
    for (let i = 0; i < branch_courses.length; i++) {
      record = branch_courses[i];
      res = await branchesCourseRepository.find({
        where: {
          id: record.id,
        },
      });

      if (!res) {
        throw new NotFoundException(
          `This record branch_courses ${record.id} does not exist`,
        );
      }
    }

    let branchId;
    let branchRes;
    for (let j = 0; j < branch_courses.length; j++) {
      branchId = branch_courses[j];
      if (branchId != undefined) {
        if (Object.keys(branchId).length === 1) {
          if (branchId?.branch_id === branchRes?.branch_id) {
            throw new ConflictException(
              `This branch_id (${branchId.branch_id}) already assign.`,
            );
          }
        }
        branchRes = await branchesCourseRepository.find({
          where: {
            id: branchId.id,
            branch_id: branchId.branch_id,
          },
        });
      }
    }
    const result = await courseRepository.createOrUpdateCourse(
      updateCoursesDto,
      branch_courses,
    );
    if (!result) {
      throw new NotFoundException('This record does not exist!');
    }
    return result;
  }

  async remove(id: number) {
    const result = await courseRepository.delete(id);
    if (result && result.affected > 0) {
      return result;
    } else {
      throw new NotFoundException('This record does not exist!');
    }
  }

  async updateCourseStatus(
    id: number,
    updateCourseStatusDto: UpdateCourseStatusDto,
  ): Promise<UpdateResult> {
    const result = await courseRepository.update(id, updateCourseStatusDto);
    if (result && result.affected > 0) {
      return result;
    } else {
      throw new NotFoundException('This record does not exist!');
    }
  }

  async findCourseById(course_id: number): Promise<Course[]> {
    const result = await courseRepository.find({ where: { id: course_id } });
    return result;
  }
}
