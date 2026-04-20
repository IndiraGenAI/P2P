import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdmissionCrm } from "./admission-crm";
import { AdmissionDocuments } from './admission-documents';
import { AdmissionFees } from './admission-fees';
import { AdmissionInstallments } from './admission-installments';
import { AdmissionOtherDocuments } from './admission-other-documents';
import { AdmissionPackages } from './admission-packages';
import { AdmissionRemarks } from './admission-remarks';
import { AdmissionStatusHistories } from './admission-status-histories';
import { AdmissionSubcourse } from './admission-subcourse';
import { AdmissionTransfer } from './admission-transfer';
import { BatchStudentAttendances } from './batch-student-attendances';
import { Batches } from './batches';
import { Branches } from './branches';
import { Departments } from './departments';
import { Expense } from './expense';
import { InvoiceFees } from './invoice-fees';
import { Invoices } from './invoices';
import { Packages } from './packages';
import { StudentDetails } from './student-details';
import { Subdepartments } from './subdepartments';
import { Users } from './users';
import { PtmStudentReportCards } from './student-ptm-reports';
import { AdmissionRecurings } from './admission-recurings';
import { BatchStudentMarks } from './batch-student-marks';

@Index('admissions_pkey', ['id'], { unique: true })
@Entity('admissions', { schema: 'public' })
export class Admissions {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'gr_id' })
  gr_id: number;

  @Column("enum", {
    name: "tally_status",
    nullable: true,
    enum: ["0", "1", "2"],
    default: () => "'0'",
  })
  tally_status: "0" | "1" | "2" | null;

  @Column("timestamp without time zone", { name: "tally_date", nullable: true })
  tally_date: Date | null;

  @Column('integer', { name: 'source_id', nullable: true })
  source_id: number | null;

  @Column('integer', { name: 'student_id' })
  student_id: number;

  @Column('integer', { name: 'branch_id', nullable: true })
  branch_id: number | null;

  @Column('boolean', {
    name: 'concession',
    nullable: true,
    default: () => 'false',
  })
  concession: boolean | null;

  @Column('numeric', {
    name: 'concession_percentage',
    nullable: true,
    precision: 5,
    scale: 2,
    default: () => 0,
  })
  concession_percentage: number | null;

  @Column('integer', { name: 'department_id', nullable: true })
  department_id: number | null;

  @Column('integer', { name: 'subdepartment_id', nullable: true })
  subdepartment_id: number | null;

  @Column('integer', { name: 'package_id', nullable: true })
  package_id: number | null;

  @Column('integer', { name: 'starting_course_id', nullable: true })
  starting_course_id: number | null;

  @Column('enum', { name: 'course_category', enum: ['SINGLE', 'PACKAGE'] })
  course_category: 'SINGLE' | 'PACKAGE';

  @Column('integer', { name: 'batch_id', nullable: true })
  batch_id: number | null;

  @Column('integer', { name: 'user_id', nullable: true })
  user_id: number | null;

  @Column('character varying', {
    name: 'enrollment_number',
    nullable: true,
    length: 100,
  })
  enrollment_number: string | null;
  
  @Column('integer', { name: 'admission_number' })
  admission_number: number;

  @Column('integer', { name: 'year' })
  year: number;

  @Column('character varying', {
    name: 'aadhar_card_no',
    nullable: true,
    length: 12,
  })
  aadhar_card_no: string | null;

  @Column('character varying', {
    name: 'passport_no',
    nullable: true,
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
    default: () => 0,
  })
  father_income: number | null;

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
    default: () => 0,
  })
  mother_income: number | null;

  @Column('numeric', {
    name: 'admission_amount',
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => 0,
  })
  admission_amount: number | null;

  @Column('numeric', {
    name: 'discount_amount',
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => 0,
  })
  discount_amount: number | null;

  @Column('numeric', {
    name: 'settlement_amount',
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => 0,
  })
  settlement_amount: number | null;

  @Column('character varying', { name: 'grade', nullable: true, length: 100 })
  grade: string | null;

  @Column('integer', { name: 'no_of_installment', nullable: true })
  no_of_installment: number | null;

  @Column('numeric', {
    name: 'registration_fees',
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => 0,
  })
  registration_fees: number | null;

  @Column('character varying', {
    name: 'present_country',
    nullable: true,
    length: 100,
  })
  present_country: string | null;

  @Column('character varying', {
    name: 'present_state',
    nullable: true,
    length: 100,
  })
  present_state: string | null;

  @Column('character varying', {
    name: 'present_city',
    nullable: true,
    length: 100,
  })
  present_city: string | null;

  @Column('character varying', {
    name: 'present_area',
    nullable: true,
    length: 100,
  })
  present_area: string | null;

  @Column('character varying', {
    name: 'present_pin_code',
    nullable: true,
    length: 15,
  })
  present_pin_code: string | null;

  @Column('character varying', {
    name: 'present_flate_house_no',
    nullable: true,
    length: 100,
  })
  present_flate_house_no: string | null;

  @Column('character varying', {
    name: 'present_area_street',
    nullable: true,
    length: 100,
  })
  present_area_street: string | null;

  @Column('character varying', {
    name: 'present_landmark',
    nullable: true,
    length: 100,
  })
  present_landmark: string | null;

  @Column('character varying', {
    name: 'permanent_country',
    nullable: true,
    length: 100,
  })
  permanent_country: string | null;

  @Column('character varying', {
    name: 'permanent_state',
    nullable: true,
    length: 100,
  })
  permanent_state: string | null;

  @Column('character varying', {
    name: 'permanent_city',
    nullable: true,
    length: 100,
  })
  permanent_city: string | null;

  @Column('character varying', {
    name: 'permanent_area',
    nullable: true,
    length: 100,
  })
  permanent_area: string | null;

  @Column('character varying', {
    name: 'permanent_pin_code',
    nullable: true,
    length: 15,
  })
  permanent_pin_code: string | null;

  @Column('character varying', {
    name: 'permanent_area_street',
    nullable: true,
    length: 100,
  })
  permanent_area_street: string | null;

  @Column('character varying', {
    name: 'permanent_landmark',
    nullable: true,
    length: 100,
  })
  permanent_landmark: string | null;

  @Column('character varying', {
    name: 'school_collage_name',
    nullable: true,
    length: 100,
  })
  school_collage_name: string | null;

  @Column('character varying', {
    name: 'school_clg_country',
    nullable: true,
    length: 100,
  })
  school_clg_country: string | null;

  @Column('character varying', {
    name: 'school_clg_state',
    nullable: true,
    length: 100,
  })
  school_clg_state: string | null;

  @Column('character varying', {
    name: 'school_clg_city',
    nullable: true,
    length: 100,
  })
  school_clg_city: string | null;

  @Column('character varying', {
    name: 'school_clg_area',
    nullable: true,
    length: 100,
  })
  school_clg_area: string | null;

  @Column('boolean', {
    name: 'send_to_father_email',
    nullable: true,
    default: () => 'false',
  })
  send_to_father_email: boolean | null;

  @Column('boolean', {
    name: 'send_to_father_sms',
    nullable: true,
    default: () => 'false',
  })
  send_to_father_sms: boolean | null;

  @Column('character varying', {
    name: 'admission_type',
    nullable: true,
    length: 100,
  })
  admission_type: string | null;

  @Column('enum', {
    name: 'status',
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
    | 'TRANSFER';

  @Column('date', { name: 'start_date', nullable: true })
  start_date: Date | null;

  @Column('date', { name: 'end_date', nullable: true })
  end_date: Date | null;

  @Column('text', { name: 'comment', nullable: true })
  comment: string | null;

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

  @Column('character varying', {
    name: 'permanent_flate_house_no',
    nullable: true,
    length: 100,
  })
  permanent_flate_house_no: string | null;

  @Column('boolean', {
    name: 'send_to_sms',
    nullable: true,
    default: () => 'false',
  })
  send_to_sms: boolean | null;

  @Column('boolean', {
    name: 'send_to_email',
    nullable: true,
    default: () => 'false',
  })
  send_to_email: boolean | null;

  @Column('enum', {
    name: 'scl_clg_type',
    nullable: true,
    enum: ['SCHOOL', 'COLLEGE'],
  })
  scl_clg_type: 'SCHOOL' | 'COLLEGE' | null;

  @Column('numeric', {
    name: 'payable_amount',
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => 0,
  })
  payable_amount: number | null;

  @Column("integer", { name: "ptm_day", nullable: true, default: () => "0" })
  ptm_day: number | null;

  @Column("integer", {
    name: "ptm_grace_after",
    nullable: true,
    default: () => "0",
  })
  ptm_grace_after: number | null;

  @Column("integer", {
    name: "ptm_grace_before",
    nullable: true,
    default: () => "0",
  })
  ptm_grace_before: number | null;

  @Column("integer", { name: "cv_day", nullable: true, default: () => "0" })
  cv_day: number | null;

  @Column("integer", {
    name: "cv_grace_after",
    nullable: true,
    default: () => "0",
  })
  cv_grace_after: number | null;

  @Column("integer", {
    name: "cv_grace_before",
    nullable: true,
    default: () => "0",
  })
  cv_grace_before: number | null;

  @Column("integer", { name: "es_day", nullable: true, default: () => "0" })
  es_day: number | null;

  @Column("integer", {
    name: "es_grace_after",
    nullable: true,
    default: () => "0",
  })
  es_grace_after: number | null;

  @Column("integer", {
    name: "es_grace_before",
    nullable: true,
    default: () => "0",
  })
  es_grace_before: number | null;

  @OneToMany(() => AdmissionCrm, (admissioncrm) => admissioncrm.admission)
  admissioncrm: AdmissionCrm[];

  @OneToMany(
    () => AdmissionOtherDocuments,
    (admission_other_documents) => admission_other_documents.admission,
  )
  admission_other_documents: AdmissionOtherDocuments[];

  @OneToMany(() => AdmissionFees, (admission_fees) => admission_fees.admission)
  admission_fees: AdmissionFees[];

  @OneToMany(
    () => AdmissionDocuments,
    (admission_documents) => admission_documents.admission,
  )
  admission_documents: AdmissionDocuments[];

  @OneToMany(
    () => AdmissionInstallments,
    (admission_installments) => admission_installments.admission,
  )
  admission_installments: AdmissionInstallments[];

  @OneToMany(
    () => AdmissionPackages,
    (admission_packages) => admission_packages.admission,
  )
  admission_packages: AdmissionPackages[];

  @OneToMany(
    () => AdmissionRemarks,
    (admission_remarks) => admission_remarks.admission,
  )
  admission_remarks: AdmissionRemarks[];

  @OneToMany(
    () => AdmissionStatusHistories,
    (admission_status_histories) => admission_status_histories.admission,
  )
  admission_status_histories: AdmissionStatusHistories[];

  @OneToMany(
    () => AdmissionSubcourse,
    (admission_subcourse) => admission_subcourse.admission,
  )
  admission_subcourses: AdmissionSubcourse[];

  @OneToMany(
    () => AdmissionTransfer,
    (admissionTransfer) => admissionTransfer.admission,
  )
  admissionTransfers: AdmissionTransfer[];

  @ManyToOne(() => Batches, (batches) => batches.admissions)
  @JoinColumn([{ name: 'batch_id', referencedColumnName: 'id' }])
  batch: Batches;

  @OneToMany(
    () => AdmissionRecurings,
    (admissionRecurings) => admissionRecurings.admission
  )
  admissionRecurings: AdmissionRecurings[];

  @ManyToOne(() => Branches, (branches) => branches.admissions)
  @JoinColumn([{ name: 'branch_id', referencedColumnName: 'id' }])
  branch: Branches;

  @ManyToOne(() => Departments, (departments) => departments.admissions)
  @JoinColumn([{ name: 'department_id', referencedColumnName: 'id' }])
  department: Departments;

  @ManyToOne(() => Packages, (packages) => packages.admissions)
  @JoinColumn([{ name: 'package_id', referencedColumnName: 'id' }])
  package: Packages;

  @ManyToOne(
    () => StudentDetails,
    (student_details) => student_details.admissions,
  )
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
  student: StudentDetails;

  @ManyToOne(
    () => Subdepartments,
    (subdepartments) => subdepartments.admissions,
  )
  @JoinColumn([{ name: 'subdepartment_id', referencedColumnName: 'id' }])
  subdepartment: Subdepartments;

  @ManyToOne(() => Users, (users) => users.admissions)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;

  @OneToMany(() => Invoices, (invoices) => invoices.admission)
  invoices: Invoices[];

  @OneToMany(
    () => BatchStudentAttendances,
    (batchStudentAttendances) => batchStudentAttendances.admission,
  )
  batchStudentAttendances: BatchStudentAttendances[];

  @OneToMany(() => Expense, (expense) => expense.admission)
  expenses: Expense[];

  @OneToMany(() => InvoiceFees, (invoice_fees) => invoice_fees.admission)
  invoice_fees: InvoiceFees[];

  @OneToMany(
    () => BatchStudentMarks,
    (Batch_student_marks) => Batch_student_marks.admission,
  )
  Batch_student_marks: BatchStudentMarks[];

  @OneToMany(
    () => PtmStudentReportCards,
    (ptmStudentReportCards) => ptmStudentReportCards.admission,
  )
  ptmStudentReportCards: PtmStudentReportCards[];
}
