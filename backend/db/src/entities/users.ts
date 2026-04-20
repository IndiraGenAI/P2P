import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdmissionSubcourse } from './admission-subcourse';
import { Admissions } from './admissions';
import { BatchFacultyAttendances } from './batch-faculty-attendances';
import { Batches } from './batches';
import { RolePermissions } from './role-permissions';
import { UserRoles } from './user-roles';
import { CvVolunteers } from './cv-volunteers';
import { CvPlanings } from './cv-planings';
import { AdmissionRecurings } from './admission-recurings';

@Index('users_email_key', ['email'], { unique: true })
@Index('users_pkey', ['id'], { unique: true })
@Entity('users', { schema: 'public' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'first_name', length: 100 })
  first_name: string;

  @Column('character varying', { name: 'last_name', length: 100 })
  last_name: string;

  @Column('character varying', { name: 'email', unique: true, length: 100 })
  email: string;

  @Column('character varying', { name: 'hash', length: 255 })
  hash: string;

  @Column('character varying', { name: 'phone', length: 15 })
  phone: string;

  @Column('timestamp without time zone', { name: 'last_seen', nullable: true })
  last_seen: Date | null;

  @Column('timestamp without time zone', {
    name: 'created_date',
    nullable: true,
  })
  created_date: Date | null;

  @Column('timestamp without time zone', {
    name: 'modified_date',
    nullable: true,
  })
  modified_date: Date | null;

  @Column('character varying', {
    name: 'created_by',
    nullable: true,
    length: 100,
  })
  created_by: string | null;

  @Column('character varying', {
    name: 'updated_by',
    nullable: true,
    length: 100,
  })
  updated_by: string | null;

  @Column('enum', {
    name: 'status',
    nullable: true,
    enum: ['ENABLE', 'DISABLE', 'PENDING'],
    default: () => "'PENDING'",
  })
  status: 'ENABLE' | 'DISABLE' | 'PENDING' | null;

  @OneToMany(
    () => AdmissionSubcourse,
    (admission_subcourse) => admission_subcourse.user,
  )
  admission_subcourses: AdmissionSubcourse[];

  @OneToMany(() => Admissions, (admissions) => admissions.user)
  admissions: Admissions[];

  @OneToMany(() => Batches, (batches) => batches.user)
  batches: Batches[];

  @OneToMany(
    () => BatchFacultyAttendances,
    (batchFacultyAttendances) => batchFacultyAttendances.user,
  )
  batchFacultyAttendances: BatchFacultyAttendances[];

  @OneToMany(() => CvPlanings, (cvPlanings) => cvPlanings.executeByUser)
  cvPlanings: CvPlanings[];

  @OneToMany(() => CvVolunteers, (cvVolunteers) => cvVolunteers.user)
  cvVolunteers: CvVolunteers[];

  @OneToMany(() => UserRoles, (user_roles) => user_roles.user)
  user_roles: UserRoles[];

  @OneToMany(
    () => RolePermissions,
    (rolePermissions) => rolePermissions.created_by2,
  )
  role_permissions: RolePermissions[];

  @OneToMany(
    () => AdmissionRecurings,
    (admissionRecurings) => admissionRecurings.faculty,
  )
  admissionRecurings: AdmissionRecurings[];
}
