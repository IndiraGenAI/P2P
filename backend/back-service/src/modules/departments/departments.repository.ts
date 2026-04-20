import { dataSource } from '@core/data-source';
import { Departments } from 'erp-db';

export const DepartmentsRepository = dataSource
  .getRepository(Departments)
  .extend({
    async createOrUpdateDepartment(
      createDepartmentDto,
      branch_department,
    ): Promise<number | undefined> {
      createDepartmentDto.name = (createDepartmentDto.name
        .trim())
        .replace(/'|"/g, "''");
      createDepartmentDto.code = (createDepartmentDto.code
        .split(' ')
        .join(''))
        .replace(/'|"/g, "''");
      const result = await DepartmentsRepository.query(
        `SELECT department_manage('${JSON.stringify(
          createDepartmentDto,
        )}','${JSON.stringify(branch_department || [])}')`,
      );
      return result && result[0] && result[0].department_manage;
    },
  });
