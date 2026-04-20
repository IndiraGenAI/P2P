import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Admissions } from './admissions';
import { BatchFacultyAttendances } from './batch-faculty-attendances';
import { BatchSingingSheet } from './batch-singing-sheet';

@Index('batch_student_attendances_pkey', ['id'], { unique: true })
@Entity('batch_student_attendances', { schema: 'public' })
export class BatchStudentAttendances {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'admission_id' })
  admission_id: number;

  @Column('integer', { name: 'batch_faculty_attendance_id' })
  batch_faculty_attendance_id: number;

  @Column('integer', { name: 'batch_singing_sheet_id' })
  batch_singing_sheet_id: number;

  @Column('boolean', {
    name: 'is_present',
    nullable: true,
    default: () => 'true',
  })
  is_present: boolean | null;

  @Column('enum', {
    name: 'feedback',
    nullable: true,
    enum: ['A', 'B', 'C', 'D'],
  })
  feedback: 'A' | 'B' | 'C' | 'D' | null;

  @Column('text', { name: 'remarks', nullable: true })
  remarks: string | null;

  @Column('boolean', {
    name: 'is_auto',
    nullable: true,
    default: () => 'false',
  })
  is_auto: boolean | null;

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

  @ManyToOne(
    () => Admissions,
    (admissions) => admissions.batchStudentAttendances,
  )
  @JoinColumn([{ name: 'admission_id', referencedColumnName: 'id' }])
  admission: Admissions;

  @ManyToOne(
    () => BatchFacultyAttendances,
    (batchFacultyAttendances) =>
      batchFacultyAttendances.batchStudentAttendances,
  )
  @JoinColumn([
    { name: 'batch_faculty_attendance_id', referencedColumnName: 'id' },
  ])
  batchFacultyAttendance: BatchFacultyAttendances;

  @ManyToOne(
    () => BatchSingingSheet,
    (batchSingingSheet) => batchSingingSheet.batchStudentAttendances,
  )
  @JoinColumn([{ name: 'batch_singing_sheet_id', referencedColumnName: 'id' }])
  batchSingingSheet: BatchSingingSheet;
}
