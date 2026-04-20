import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdmissionInstallments } from './admission-installments';
import { AdmissionSubcourse } from './admission-subcourse';
import { AdmissionTransfer } from './admission-transfer';
import { Admissions } from './admissions';
import { BatchSingingSheet } from './batch-singing-sheet';
import { Branches } from './branches';
import { Course } from './course';
import { Subcourses } from './subcourses';
import { TemplateShiningSheet } from './template-shining-sheet';
import { Users } from './users';
import { BatchStudentMarks } from './batch-student-marks';
@Index('batches_code_unique', ['code'], { unique: true })
@Index('batches_pkey', ['id'], { unique: true })
@Entity('batches', { schema: 'public' })
export class Batches {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'branch_id' })
  branch_id: number;

  @Column('integer', { name: 'course_id' })
  course_id: number;

  @Column('integer', { name: 'subcourse_id' })
  subcourse_id: number;

  @Column('integer', { name: 'user_id' })
  user_id: number;

  @Column('character varying', { name: 'code', unique: true, length: 100 })
  code: string;

  @Column('character varying', { name: 'name', length: 100 })
  name: string;

  @Column('numeric', {
    name: 'duration',
    nullable: true,
    precision: 5,
    scale: 2,
  })
  duration: number | null;

  @Column('enum', {
    name: 'batches_status',
    nullable: true,
    enum: [
      'ONGOING',
      'UP_COMING',
      'ON_HOLD',
      'ON_VACATION',
      'COMPLETED',
      'CANCELLED',
    ],
  })
  batches_status:
    | 'ONGOING'
    | 'UP_COMING'
    | 'ON_HOLD'
    | 'ON_VACATION'
    | 'COMPLETED'
    | 'CANCELLED';

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
  updatedDate: Date | null;

  @Column('date', { name: 'start_date', nullable: true })
  start_date: Date | null;

  @Column('date', { name: 'end_date', nullable: true })
  end_date: Date | null;

  @Column('numeric', {
    name: 'batch_time',
    nullable: true,
    precision: 5,
    scale: 2,
  })
  batch_time: number | null;

  @Column('boolean', {
    name: 'day_one',
    nullable: true,
    default: () => 'false',
  })
  day_one: boolean | null;

  @Column('boolean', {
    name: 'day_two',
    nullable: true,
    default: () => 'false',
  })
  day_two: boolean | null;

  @Column('boolean', {
    name: 'day_three',
    nullable: true,
    default: () => 'false',
  })
  day_three: boolean | null;

  @Column('boolean', {
    name: 'day_four',
    nullable: true,
    default: () => 'false',
  })
  day_four: boolean | null;

  @Column('boolean', {
    name: 'day_five',
    nullable: true,
    default: () => 'false',
  })
  day_five: boolean | null;

  @Column('boolean', {
    name: 'day_six',
    nullable: true,
    default: () => 'false',
  })
  day_six: boolean | null;

  @Column('boolean', {
    name: 'day_seven',
    nullable: true,
    default: () => 'false',
  })
  day_seven: boolean | null;

  @Column('integer', { name: 'template_id' })
  template_id: number;

  @Column('integer', { name: 'number_of_days' })
  number_of_days: number;

  @Column("character varying", {
    name: "examportal_branch_id",
    nullable: true,
    length: 255,
  })
  examportal_branch_id: string | null;

  @OneToMany(
    () => AdmissionSubcourse,
    (admission_subcourse) => admission_subcourse.batch,
  )
  admission_subcourses: AdmissionSubcourse[];

  @OneToMany(
    () => AdmissionTransfer,
    (admissionTransfer) => admissionTransfer.batch,
  )
  admissionTransfers: AdmissionTransfer[];

  @OneToMany(
    () => AdmissionInstallments,
    (admission_installments) => admission_installments.branch,
  )
  admission_installments: AdmissionInstallments[];

  @OneToMany(() => Admissions, (admissions) => admissions.batch)
  admissions: Admissions[];

  @ManyToOne(() => Branches, (branches) => branches.batches)
  @JoinColumn([{ name: 'branch_id', referencedColumnName: 'id' }])
  branch: Branches;

  @ManyToOne(() => Course, (course) => course.batches)
  @JoinColumn([{ name: 'course_id', referencedColumnName: 'id' }])
  course: Course;

  @ManyToOne(() => Subcourses, (subcourses) => subcourses.batches)
  @JoinColumn([{ name: 'subcourse_id', referencedColumnName: 'id' }])
  subcourse: Subcourses;

  @OneToMany(
    () => BatchSingingSheet,
    (batchSingingSheet) => batchSingingSheet.batch,
  )
  batchSingingSheets: BatchSingingSheet[];

  @ManyToOne(
    () => TemplateShiningSheet,
    (templateShiningSheet) => templateShiningSheet.batches,
  )
  @JoinColumn([{ name: 'template_id', referencedColumnName: 'id' }])
  template: TemplateShiningSheet;

  @OneToMany(
    () => BatchStudentMarks,
    (Batch_student_marks) => Batch_student_marks.batch,
  )
  Batch_student_marks: BatchStudentMarks[];

  @ManyToOne(() => Users, (users) => users.batches)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
