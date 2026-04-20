import { dataSource } from 'src/core/data-source';
import {
  BranchCourse,
  BranchDepartments,
  PackageBranches,
  Packages,
  PackageSubcourses,
} from 'erp-db';
import { branchDepartementRepository } from '@modules/departments/branchdepartement.repository';
import { In } from 'typeorm';
import {
  BranchCourseResponse,
  GetMultipleBranchWiseCommonCourse,
} from './dto/branch-department-course.dto';
export const packageRepository = dataSource.getRepository(Packages).extend({
  async findAll(offset?: number, limit?: number): Promise<Packages[]> {
    return await packageRepository.find({
      relations: {
        package_fees: true,
        package_subcourses: true,
        package_branches: true,
      },
    });
  },

  async createOrUpdatePackage(
    courseConfig,
    createPackageDto,
    package_fees,
    package_subcourses,
    package_branches,
  ): Promise<number | undefined> {
    createPackageDto.name = (createPackageDto.name.trim())?.replace(/'|"/g, "''");
    createPackageDto.code = (createPackageDto.code.split(' ').join(''))?.replace(/'|"/g, "''");;
    const result = await packageRepository.query(
      `SELECT package_manage('${JSON.stringify(
        courseConfig,
      )}','${JSON.stringify(
        createPackageDto,
      )}', '${JSON.stringify(package_fees || [])}', '${JSON.stringify(
        package_subcourses || [],
      )}', '${JSON.stringify(package_branches || [])}')`,
    );
    return result && result[0] && result[0].package_manage;
  },
});

export const packageBranchesRepository =
  dataSource.getRepository(PackageBranches);

export const branchDdepartmentsRepository = dataSource
  .getRepository(BranchDepartments)
  .extend({
    async BranchDepartmentsInfo(): Promise<[BranchDepartments[], number]> {
      const data = await branchDepartementRepository.findAndCount({
        select: {
          id: true,
          branch_id: true,
          department_id: true,
          department: {
            id: true,
            courses: {
              id: true,
            },
          },
        },
        relations: {
          department_id: true,
        },
      });
      return data;
    },
  });

export const branchCourseRepository = dataSource
  .getRepository(BranchCourse)
  .extend({
    async getBranchWiseCommonCourse(
      getMultipleBranchWiseCommonCourse: GetMultipleBranchWiseCommonCourse,
    ): Promise<BranchCourseResponse> {
      const { branch_ids } = getMultipleBranchWiseCommonCourse;
      const data = await branchCourseRepository.findAndCount({
        where: {
          branch_id: In(branch_ids),
        },
        select: {
          id: true,
          branch_id: true,
          course_id: true,
          branch: {
            id: true,
            name: true,
            code: true,
          },
          course: {
            id: true,
            name: true,
            code: true,
          },
        },
        relations: {
          branch: true,
          course: true,
        },
      });
      const result: BranchCourseResponse = {
        rows: data[0],
        count: data[0].length,
      };
      return result;
    },
  });

export const packageSubCoursesRepository =
  dataSource.getRepository(PackageSubcourses);
