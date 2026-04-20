import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Batches } from './batches';
import { Departments } from './departments';
import { Subdepartments } from './subdepartments';
import { Subcourses } from './subcourses';
import { Admissions } from './admissions';
import { AdmissionSubcourse } from './admission-subcourse';
import { BranchCourse } from './branch-course';
import { UserRoleCourses } from './user-role-courses';

@Index('course_code_key', ['code'], { unique: true })
@Index('course_pkey', ['id'], { unique: true })
@Index('course_name_key', ['name'], { unique: true })
@Entity('course', { schema: 'public' })
export class Course {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'department_id' })
  department_id: number;

  @Column('integer', { name: 'subdepartment_id' })
  subdepartment_id: number;

  @Column('character varying', { name: 'name', unique: true, length: 100 })
  name: string;

  @Column('character varying', { name: 'code', unique: true, length: 50 })
  code: string;

  @Column('boolean', { name: 'status', nullable: true, default: () => 'true' })
  status: boolean | null;

  @Column('character varying', {
    name: 'created_by',
    nullable: true,
    length: 100,
  })
  created_by: string | null;

  @Column('timestamp without time zone', {
    name: 'created_date',
    nullable: true,
  })
  created_date: Date | null;

  @Column('character varying', {
    name: 'updated_by',
    nullable: true,
    length: 100,
  })
  updated_by: string | null;

  @Column('timestamp without time zone', {
    name: 'updated_date',
    nullable: true,
  })
  updated_date: Date | null;

  @OneToMany(
    () => AdmissionSubcourse,
    (admission_subcourse) => admission_subcourse.course,
  )
  admission_subcourses: AdmissionSubcourse[];

  @OneToMany(() => Batches, (batches) => batches.course)
  batches: Batches[];

  @OneToMany(() => BranchCourse, (branch_course) => branch_course.course)
  branch_courses: BranchCourse[];

  @ManyToOne(() => Departments, (departments) => departments.courses)
  @JoinColumn([{ name: 'department_id', referencedColumnName: 'id' }])
  department: Departments;

  @ManyToOne(() => Subdepartments, (subdepartments) => subdepartments.courses)
  @JoinColumn([{ name: 'subdepartment_id', referencedColumnName: 'id' }])
  subdepartment: Subdepartments;

  @OneToMany(() => Subcourses, (subcourses) => subcourses.course)
  subcourses: Subcourses[];

  @OneToMany(
    () => UserRoleCourses,
    (user_role_courses) => user_role_courses.course,
  )
  user_role_courses: UserRoleCourses[];
}
