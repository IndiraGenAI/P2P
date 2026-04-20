import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Admissions } from './admissions';
import { Batches } from './batches';
import { BatchSingingSheet } from './batch-singing-sheet';

@Index('batch_student_marks_pkey', ['id'], { unique: true })
@Entity('batch_student_marks', { schema: 'public' })
export class BatchStudentMarks {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'admission_id' })
  admission_id: number;

  @Column('integer', { name: 'batch_id' })
  batch_id: number | null;

  @Column('integer', { name: 'batch_singing_sheet_id' })
  batch_singing_sheet_id: number;

  @Column('integer', { name: 'total_marks' })
  total_marks: number;

  @Column('integer', { name: 'marks', nullable: true })
  marks: number | null;

  @Column('date', { name: 'due_date' })
  due_date: string;

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

  @Column("text", { name: "examportal_test_token", nullable: true })
  examportal_test_token: string | null;

  @Column("character varying", {
    name: "examportal_test_id",
    nullable: true,
    length: 255,
  })
  examportal_test_id: string | null;

  @ManyToOne(() => Admissions, (admissions) => admissions.Batch_student_marks)
  @JoinColumn([{ name: 'admission_id', referencedColumnName: 'id' }])
  admission: Admissions;

  @ManyToOne(() => Batches, (batches) => batches.Batch_student_marks)
  @JoinColumn([{ name: 'batch_id', referencedColumnName: 'id' }])
  batch: Batches;

  @ManyToOne(
    () => BatchSingingSheet,
    (batchSingingSheet) => batchSingingSheet.Batch_student_marks,
  )
  @JoinColumn([{ name: 'batch_singing_sheet_id', referencedColumnName: 'id' }])
  batchSingingSheet: BatchSingingSheet;
}
