import { DepartmentsModule } from './departments/departments.module';
import { CourseModule } from './course/course.module';
import { PackagesModule } from './packages/packages.module';
import { CommonModule } from './common/common.module';
import { AreasModule } from './areas/areas.module';
import { BatchModule } from '@providers/exam-portal/batch.module';


export const ApplicationModules = [
  DepartmentsModule,
  CourseModule,
  PackagesModule,
  CommonModule,
  AreasModule,
  BatchModule,
];
