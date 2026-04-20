import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Admissions } from './admissions';
import { Users } from './users';

@Index('admission_recurings_pkey', ['id'], { unique: true })
@Entity('admission_recurings', { schema: 'public' })
export class AdmissionRecurings {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'admission_id' })
  admission_id: number;

  @Column('integer', { name: 'faculty_id' })
  faculty_id: number;

  @Column('enum', { name: 'type', enum: ['PTM', 'CV', 'ES'] })
  type: 'PTM' | 'CV' | 'ES';

  @Column('integer', { name: 'type_id', nullable: true })
  type_id: number | null;

  @Column('date', { name: 'start_date', nullable: true })
  start_date: string | null;

  @Column('date', { name: 'plan_date', nullable: true })
  plan_date: string | null;

  @Column('date', { name: 'end_date', nullable: true })
  end_date: string | null;

  @Column('date', { name: 'actutal_date', nullable: true })
  actutal_date: string | null;

  @Column('boolean', { name: 'is_present', nullable: true })
  is_present: boolean | null;

  @Column('enum', {
    name: 'status',
    nullable: true,
    enum: ['PENDING', 'INPROGRESS', 'COMPLETED'],
    default: () => "'PENDING'",
  })
  status: 'PENDING' | 'INPROGRESS' | 'COMPLETED' | null;

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

  @ManyToOne(() => Admissions, (admissions) => admissions.admissionRecurings)
  @JoinColumn([{ name: 'admission_id', referencedColumnName: 'id' }])
  admission: Admissions;

  @ManyToOne(() => Users, (users) => users.admissionRecurings)
  @JoinColumn([{ name: 'faculty_id', referencedColumnName: 'id' }])
  faculty: Users;
}
