import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Admissions } from "./admissions";

@Index("ptm_student_report_cards_pkey", ["id"], { unique: true })
@Entity("ptm_student_report_cards", { schema: "public" })
export class PtmStudentReportCards {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "admission_id" })
  admission_id: number;

  @Column("enum", {
    name: "uniform",
    nullable: true,
    enum: ["REGULAR", "IRREGULAR"],
  })
  uniform: "REGULAR" | "IRREGULAR" | null;

  @Column("enum", {
    name: "discipline",
    nullable: true,
    enum: ["BAD", "MEDIUM", "GOOD"],
  })
  discipline: "BAD" | "MEDIUM" | "GOOD" | null;

  @Column("integer", {
    name: "behaviour_with_faculty",
    nullable: true,
    default: () => "0",
  })
  behaviour_with_faculty: number | null;

  @Column("integer", {
    name: "behaviour_with_management",
    nullable: true,
    default: () => "0",
  })
  behaviour_with_management: number | null;

  @Column("integer", {
    name: "behaviour_with_student",
    nullable: true,
    default: () => "0",
  })
  behaviour_with_student: number | null;

  @Column("text", { name: "remark", nullable: true })
  remark: string | null;

  @Column("integer", { name: "total_days", nullable: true })
  total_days: number | null;

  @Column("integer", { name: "attendance_days", nullable: true })
  attendance_days: number | null;

  @Column("text", { name: "running_course", nullable: true })
  running_course: string | null;

  @Column("text", { name: "completed_course", nullable: true })
  completed_course: string | null;

  @Column("text", { name: "work_submission", nullable: true })
  work_submission: string | null;

  @Column("character varying", {
    name: "visiting_person",
    nullable: true,
    length: 100,
  })
  visiting_person: string | null;

  @Column("enum", {
    name: "relation_with_student",
    nullable: true,
    enum: ["FATHER", "MOTHER", "SISTER", "UNCLE", "AUNTY", "OTHER"],
  })
  relation_with_student:
    | "FATHER"
    | "MOTHER"
    | "SISTER"
    | "UNCLE"
    | "AUNTY"
    | "OTHER"
    | null;

  @Column("character varying", {
    name: "visitor_mobile_no",
    nullable: true,
    length: 15,
    default: () => "NULL::character varying",
  })
  visitor_mobile_no: string | null;

  @Column("timestamp without time zone", {
    name: "visiting_datetime",
    nullable: true,
  })
  visiting_datetime: Date | null;

  @Column("text", { name: "visitor_remark", nullable: true })
  visitor_remark: string | null;

  @Column('enum', {
    name: 'status',
    enum: ['PENDING', 'COMPLETED'],
  })
  status: 'PENDING' | 'COMPLETED';

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

  @ManyToOne(() => Admissions, (admissions) => admissions.ptmStudentReportCards)
  @JoinColumn([{ name: "admission_id", referencedColumnName: "id" }])
  admission: Admissions;
}
