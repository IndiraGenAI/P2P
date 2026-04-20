import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Admissions } from './admissions';
import { BranchDepartments } from './branch-departments';
import { Course } from './course';
import { Expense } from './expense';
import { ExpenseMaster } from './expense-master';
import { Packages } from './packages';
import { Subdepartments } from './subdepartments';
import { UserRoleDepartments } from './user-role-departments';

@Index('code_department_unique', ['code'], { unique: true })
@Index('departments_pkey', ['id'], { unique: true })
@Index('name_department_unique', ['name'], { unique: true })
@Entity('departments', { schema: 'public' })
export class Departments {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name', unique: true, length: 100 })
  name: string;

  @Column('character varying', { name: 'code', unique: true, length: 50 })
  code: string;

  @Column('boolean', { name: 'status', nullable: true, default: () => 'true' })
  status: boolean | null;

  @Column('boolean', { name: 'photos', nullable: true, default: () => 'false' })
  photos: boolean | null;

  @Column('boolean', {
    name: 'tenth_marksheet',
    nullable: true,
    default: () => 'false',
  })
  tenth_marksheet: boolean | null;

  @Column('boolean', {
    name: 'twelfth_marksheet',
    nullable: true,
    default: () => 'false',
  })
  twelfth_marksheet: boolean | null;

  @Column('boolean', {
    name: 'leaving_certy',
    nullable: true,
    default: () => 'false',
  })
  leaving_certy: boolean | null;

  @Column('boolean', {
    name: 'adhar_card',
    nullable: true,
    default: () => 'false',
  })
  adhar_card: boolean | null;

  @Column('boolean', { name: 'other', nullable: true, default: () => 'false' })
  other: boolean | null;

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

  @OneToMany(() => Admissions, (admissions) => admissions.department)
  admissions: Admissions[];

  @OneToMany(
    () => BranchDepartments,
    (branch_departments) => branch_departments.department,
  )
  branch_departments: BranchDepartments[];

  @OneToMany(() => Course, (course) => course.department)
  courses: Course[];

  @OneToMany(() => Expense, (expense) => expense.department)
  expenses: Expense[];

  @OneToMany(() => ExpenseMaster, (expenseMaster) => expenseMaster.department)
  expenseMasters: ExpenseMaster[];

  @OneToMany(() => Packages, (packages) => packages.department)
  packages: Packages[];

  @OneToMany(
    () => Subdepartments,
    (subdepartments) => subdepartments.department,
  )
  subdepartments: Subdepartments[];

  @OneToMany(
    () => UserRoleDepartments,
    (user_role_departments) => user_role_departments.department,
  )
  user_role_departments: UserRoleDepartments[];
}
