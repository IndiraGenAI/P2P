import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BatchFacultyAttendances } from './batch-faculty-attendances';
import { Batches } from './batches';
import { SubcourseTopics } from './subcourse-topics';
import { BatchStudentAttendances } from './batch-student-attendances';
import { BatchStudentMarks } from './batch-student-marks';

@Index('batch_singing_sheet_pkey', ['id'], { unique: true })
@Entity('batch_singing_sheet', { schema: 'public' })
export class BatchSingingSheet {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'batch_id' })
  batch_id: number;

  @Column('integer', { name: 'parent_id', nullable: true })
  parent_id: number | null;

  @Column('character varying', { name: 'name', nullable: true, length: 100 })
  name: string | null;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('numeric', {
    name: 'sequence',
    nullable: true,
    precision: 5,
    scale: 2,
  })
  sequence: number | null;

  @Column("enum", {
    name: "type",
    nullable: true,
    enum: ["LECTURE", "PROJECT", "VIVA", "EXAM_PRACTICAL", "EXAM_THEORY"],
  })
  type:
    | "LECTURE"
    | "PROJECT"
    | "VIVA"
    | "EXAM_PRACTICAL"
    | "EXAM_THEORY"
    | null;


  @Column('numeric', {
    name: 'duration',
    nullable: true,
    precision: 5,
    scale: 2,
  })
  duration: number | null;

  @Column('numeric', { name: 'marks', nullable: true, precision: 5, scale: 2 })
  marks: number | null;

  @Column('date', { name: 'planned_start_date', nullable: true })
  planned_start_date: Date | null;

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
    () => BatchFacultyAttendances,
    (batchFacultyAttendances) => batchFacultyAttendances.batchSingingSheet,
  )
  batchFacultyAttendances: BatchFacultyAttendances[];

  @ManyToOne(() => Batches, (batches) => batches.batchSingingSheets)
  @JoinColumn([{ name: 'batch_id', referencedColumnName: 'id' }])
  batch: Batches;

  @ManyToOne(
    () => BatchSingingSheet,
    (batchSingingSheet) => batchSingingSheet.batchSingingSheets,
  )
  @JoinColumn([{ name: 'parent_id', referencedColumnName: 'id' }])
  parent: BatchSingingSheet;

  @OneToMany(
    () => BatchSingingSheet,
    (batchSingingSheet) => batchSingingSheet.parent,
  )
  batchSingingSheets: BatchSingingSheet[];

  @OneToMany(
    () => BatchStudentAttendances,
    (batchStudentAttendances) => batchStudentAttendances.batchSingingSheet,
  )
  batchStudentAttendances: BatchStudentAttendances[];

  @OneToMany(
    () => BatchStudentMarks,
    (Batch_student_marks) => Batch_student_marks.batchSingingSheet,
  )
  Batch_student_marks: BatchStudentMarks[];
}
