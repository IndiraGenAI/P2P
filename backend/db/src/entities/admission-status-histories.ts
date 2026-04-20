import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Admissions } from './admissions';

@Index('admission_status_histories_pkey', ['id'], { unique: true })
@Entity('admission_status_histories', { schema: 'public' })
export class AdmissionStatusHistories {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'admission_id' })
  admission_id: number;

  @Column('enum', {
    name: 'status',
    enum: [
      'ONGOING',
      'PENDING',
      'HOLD',
      'TERMINATED',
      'CANCELLED',
      'COMPLETED',
      'TRANSFERRED_IN',
      'TRANSFERRED_OUT',
    ],
  })
  status:
    | 'ONGOING'
    | 'PENDING'
    | 'HOLD'
    | 'TERMINATED'
    | 'CANCELLED'
    | 'COMPLETED'
    | 'TRANSFERRED_IN'
    | 'TRANSFERRED_OUT';

  @Column('text', { name: 'comment', nullable: true })
  comment: string | null;

  @Column('character varying', {
    name: 'created_by',
    nullable: true,
    length: 100,
  })
  created_by: string | null;

  @Column('date', { name: 'start_date', nullable: true })
  start_date: Date | null;

  @Column('date', { name: 'end_date', nullable: true })
  end_date: Date | null;

  @ManyToOne(
    () => Admissions,
    (admissions) => admissions.admission_status_histories,
  )
  @JoinColumn([{ name: 'admission_id', referencedColumnName: 'id' }])
  admission: Admissions;
}
