import { dataSource } from 'src/core/data-source';
import { Course } from 'erp-db';

export const courseRepository = dataSource.getRepository(Course).extend({
  async findAll(offset?: number, limit?: number): Promise<Course[]> {
    return await courseRepository.find({
      relations: {
        department: true,
        subdepartment: true,
      },
    });
  },

  async createOrUpdateCourse(
    createCourseDto,
    branch_course,
  ): Promise<number | undefined> {
    createCourseDto.name = (createCourseDto.name.trim()).replace(/'|"/g,"''")
    createCourseDto.code = (createCourseDto.code.split(' ').join('')).replace(/'|"/g,"''")
    const result = await courseRepository.query(
      `SELECT course_manage('${JSON.stringify(
        createCourseDto,
      )}','${JSON.stringify(branch_course || [])}')`,
    );
    return result && result[0] && result[0].course_manage;
  },
});
