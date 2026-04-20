import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Admissions } from './admissions';

@Index('student_details_aadhar_card_no_key', ['aadhar_card_no'], {
  unique: true,
})
@Index('student_details_pkey', ['id'], { unique: true })
@Index('student_details_passport_no_key', ['passport_no'], { unique: true })
@Entity('student_details', { schema: 'public' })
export class StudentDetails {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'gr_id' })
  gr_id: number;

  @Column('character varying', {
    name: 'aadhar_card_no',
    nullable: true,
    unique: true,
    length: 12,
  })
  aadhar_card_no: string | null;

  @Column('character varying', {
    name: 'passport_no',
    nullable: true,
    unique: true,
    length: 12,
  })
  passport_no: string | null;

  @Column('boolean', { name: 'is_nri', nullable: true, default: () => 'false' })
  is_nri: boolean | null;

  @Column('character varying', {
    name: 'first_name',
    nullable: true,
    length: 100,
  })
  first_name: string | null;

  @Column('character varying', {
    name: 'middle_name',
    nullable: true,
    length: 100,
  })
  middle_name: string | null;

  @Column('character varying', {
    name: 'last_name',
    nullable: true,
    length: 100,
  })
  last_name: string | null;

  @Column('character varying', { name: 'email', nullable: true, length: 100 })
  email: string | null;

  @Column('character varying', {
    name: 'mobile_no',
    nullable: true,
    length: 15,
  })
  mobile_no: string | null;

  @Column('character varying', {
    name: 'alternate_no',
    nullable: true,
    length: 15,
  })
  alternate_no: string | null;

  @Column('date', { name: 'dob', nullable: true })
  dob: Date | null;

  @Column('enum', { name: 'gender', enum: ['MALE', 'FEMALE', 'OTHER'] })
  gender: 'MALE' | 'FEMALE' | 'OTHER';

  @Column('character varying', {
    name: 'father_name',
    nullable: true,
    length: 100,
  })
  father_name: string | null;

  @Column('character varying', {
    name: 'father_email',
    nullable: true,
    length: 100,
  })
  father_email: string | null;

  @Column('character varying', {
    name: 'father_mobile_no',
    nullable: true,
    length: 100,
  })
  father_mobile_no: string | null;

  @Column('character varying', {
    name: 'father_occupation',
    nullable: true,
    length: 100,
  })
  father_occupation: string | null;

  @Column('numeric', {
    name: 'father_income',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  father_income: string | null;

  @Column('character varying', {
    name: 'mother_name',
    nullable: true,
    length: 100,
  })
  mother_name: string | null;

  @Column('character varying', {
    name: 'mother_email',
    nullable: true,
    length: 100,
  })
  mother_email: string | null;

  @Column('character varying', {
    name: 'mother_mobile_no',
    nullable: true,
    length: 100,
  })
  mother_mobile_no: string | null;

  @Column('character varying', {
    name: 'mother_occupation',
    nullable: true,
    length: 100,
  })
  mother_occupation: string | null;

  @Column('numeric', {
    name: 'mother_income',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  mother_income: string | null;

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

  @OneToMany(() => Admissions, (admissions) => admissions.student)
  admissions: Admissions[];
}
