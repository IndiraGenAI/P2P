import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Admissions } from './admissions';
import { Branches } from './branches';

@Index('admission_remarks_pkey', ['id'], { unique: true })
@Entity('admission_remarks', { schema: 'public' })
export class AdmissionRemarks {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'admission_id' })
  admission_id: number;

  @Column('integer', { name: 'branch_id' })
  branch_id: number;

  @Column('character varying', { name: 'labels', nullable: true, length: 100 })
  labels: string | null;

  @Column('character varying', { name: 'rating', nullable: true, length: 100 })
  rating: string | null;

  @Column('text', { name: 'remarks', nullable: true })
  remarks: string | null;

  @Column('enum', {
    name: 'status',
    nullable: true,
    enum: [
      'ONGOING',
      'PENDING',
      'HOLD',
      'TERMINATED',
      'CANCELLED',
      'COMPLETED',
      'TRANSFER',
    ],
  })
  status:
    | 'ONGOING'
    | 'PENDING'
    | 'HOLD'
    | 'TERMINATED'
    | 'CANCELLED'
    | 'COMPLETED'
    | 'TRANSFER'
    | null;

  @Column('enum', { name: 'type', enum: ['PRIVATE', 'PUBLIC'] })
  type: 'PRIVATE' | 'PUBLIC';

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

  @ManyToOne(() => Admissions, (admissions) => admissions.admission_remarks)
  @JoinColumn([{ name: 'admission_id', referencedColumnName: 'id' }])
  admission: Admissions;

  @ManyToOne(() => Branches, (branches) => branches.admission_remarks)
  @JoinColumn([{ name: 'branch_id', referencedColumnName: 'id' }])
  branch: Branches;
}
