import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Batches } from "./batches";
import { Zones } from "./zones";
import { PackageBranches } from "./package-branches";
import { BranchDepartments } from "./branch-departments";
import { AdmissionRemarks } from "./admission-remarks";
import { Admissions } from "./admissions";
import { BranchCourse } from "./branch-course";
import { AdmissionInstallments } from "./admission-installments";
import { Invoices } from "./invoices";
import { AdmissionTransfer } from "./admission-transfer";
import { Expense } from "./expense";
import { ExpenseMaster } from "./expense-master";
import { CvPlanings } from "./cv-planings";

@Index("branches_code_key", ["code"], { unique: true })
@Index("branches_examportal_unique_id_key", ["examportal_unique_id"], {
  unique: true,
})
@Index("branches_pkey", ["id"], { unique: true })
@Entity("branches", { schema: "public" })
export class Branches {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "zone_id" })
  zone_id: number;

  @Column("character varying", { name: "name", nullable: true, length: 100 })
  name: string | null;

  @Column("character varying", {
    name: "code",
    nullable: true,
    unique: true,
    length: 100,
  })
  code: string | null;

  @Column("character varying", { name: "title", nullable: true, length: 150 })
  title: string | null;

  @Column("character varying", { name: "email", nullable: true, length: 100 })
  email: string | null;

  @Column("character varying", {
    name: "landline_no",
    nullable: true,
    length: 15,
  })
  landline_no: string | null;

  @Column("character varying", {
    name: "mobile_one",
    nullable: true,
    length: 15,
  })
  mobile_one: string | null;

  @Column("character varying", {
    name: "mobile_two",
    nullable: true,
    length: 15,
  })
  mobile_two: string | null;

  @Column("character varying", { name: "website", nullable: true, length: 50 })
  website: string | null;

  @Column("character varying", { name: "pan_no", nullable: true, length: 25 })
  pan_no: string | null;

  @Column("character varying", { name: "cin", nullable: true, length: 25 })
  cin: string | null;

  @Column("character varying", { name: "gst_no", nullable: true, length: 25 })
  gst_no: string | null;

  @Column("character varying", {
    name: "bank_name",
    nullable: true,
    length: 50,
  })
  bank_name: string | null;

  @Column("character varying", {
    name: "account_holder_name",
    nullable: true,
    length: 50,
  })
  account_holder_name: string | null;

  @Column("character varying", {
    name: "account_no",
    nullable: true,
    length: 50,
  })
  account_no: number | null;

  @Column("character varying", { name: "ifsc", nullable: true, length: 15 })
  ifsc: string | null;

  @Column("character varying", {
    name: "account_type",
    nullable: true,
    length: 25,
  })
  account_type: string | null;

  @Column("character varying", { name: "logo", nullable: true, length: 25 })
  logo: string | null;

  @Column("character varying", { name: "address", nullable: true, length: 255 })
  address: string | null;

  @Column("character varying", { name: "country", nullable: true, length: 100 })
  country: string | null;

  @Column("character varying", { name: "state", nullable: true, length: 100 })
  state: string | null;

  @Column("character varying", { name: "city", nullable: true, length: 100 })
  city: string | null;

  @Column("character varying", { name: "area", nullable: true, length: 100 })
  area: string | null;

  @Column("boolean", { name: "status", nullable: true, default: () => "true" })
  status: boolean | null;

  @Column("character varying", {
    name: "created_by",
    nullable: true,
    length: 100,
  })
  created_by: string | null;

  @Column("timestamp without time zone", {
    name: "created_date",
    nullable: true,
  })
  created_date: Date | null;

  @Column("character varying", {
    name: "updated_by",
    nullable: true,
    length: 100,
  })
  updated_by: string | null;

  @Column("timestamp without time zone", {
    name: "updated_date",
    nullable: true,
  })
  updated_date: Date | null;

  @Column("integer", {
    name: "enrolment_no_sequence",
    nullable: true,
    default: () => 0,
  })
  enrolment_no_sequence: number | null;

  @Column("integer", {
    name: "invoice_no_sequence",
    nullable: true,
    default: () => 0,
  })
  invoice_no_sequence: number | null;

  @Column("boolean", { name: "isgst", nullable: true, default: () => "false" })
  isgst: boolean | null;

  @Column("boolean", { name: "iscomposition", nullable: true })
  iscomposition: boolean | null;

  @Column("character varying", {
    name: "examportal_url",
    nullable: true,
    length: 255,
  })
  examportal_url: string | null;

  @Column("character varying", {
    name: "examportal_email",
    nullable: true,
    length: 100,
  })
  examportal_email: string | null;

  @Column("character varying", {
    name: "examportal_password",
    nullable: true,
    length: 10,
  })
  examportal_password: string | null;

  @Column("character varying", {
    name: "examportal_unique_id",
    nullable: true,
    unique: true,
    length: 30,
  })
  examportal_unique_id: string | null;

  @Column("boolean", {
    name: "examportal_status",
    nullable: true,
    default: () => "false",
  })
  examportal_status: boolean | null;

  @Column("character varying", {
    name: "invoice_format",
    nullable: true,
    length: 10,
  })
  invoice_format: string | null;

  @OneToMany(
    () => AdmissionInstallments,
    (admission_installments) => admission_installments.branch
  )
  admission_installments: AdmissionInstallments[];

  @OneToMany(
    () => AdmissionRemarks,
    (admission_remarks) => admission_remarks.branch
  )
  admission_remarks: AdmissionRemarks[];

  @OneToMany(
    () => AdmissionTransfer,
    (admissionTransfer) => admissionTransfer.branchIn
  )
  admissionTransfers: AdmissionTransfer[];

  @OneToMany(
    () => AdmissionTransfer,
    (admissionTransfer) => admissionTransfer.branchOut
  )
  admissionTransfers2: AdmissionTransfer[];
  

  @OneToMany(() => Admissions, (admissions) => admissions.branch)
  admissions: Admissions[];

  @OneToMany(() => Batches, (batches) => batches.branch)
  batches: Batches[];

  @OneToMany(() => BranchCourse, (branch_course) => branch_course.branch)
  branch_courses: BranchCourse[];

  @OneToMany(
    () => BranchDepartments,
    (branch_departments) => branch_departments.branch
  )
  branch_departments: BranchDepartments[];

  @ManyToOne(() => Zones, (zones) => zones.branches)
  @JoinColumn([{ name: "zone_id", referencedColumnName: "id" }])
  zone: Zones;

  @OneToMany(() => CvPlanings, (cvPlanings) => cvPlanings.branch)
  cvPlanings: CvPlanings[];

  @OneToMany(() => Expense, (expense) => expense.branch)
  expenses: Expense[];

  @OneToMany(() => Invoices, (invoices) => invoices.branch)
  invoices: Invoices[];

  @OneToMany(
    () => PackageBranches,
    (package_branches) => package_branches.branch
  )
  package_branches: PackageBranches[];
}
