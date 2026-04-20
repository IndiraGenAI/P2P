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
import { PackageSubcourses } from "./package-subcourses";
import { ShiningSheetTopic } from "./shining-sheet-topic";
import { SubcourseFees } from "./subcourse-fees";
import { CourseConfigs } from "./course-configs";
import { Course } from "./course";
import { AdmissionSubcourse } from "./admission-subcourse";
import { AdmissionSubcourseFees } from "./admission-subcourse-fees";
import { AdmissionTransfer } from "./admission-transfer";
import { SubcourseTopics } from "./subcourse-topics";
import { TemplateShiningSheet } from "./template-shining-sheet";

@Index("subcourses_pkey", ["id"], { unique: true })
@Entity("subcourses", { schema: "public" })
export class Subcourses {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "course_id" })
  course_id: number;

  @Column("integer", { name: "course_config_id" })
  course_config_id: number;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("character varying", { name: "code", length: 50 })
  code: string;

  @Column("boolean", {
    name: "is_job_guarantee",
    nullable: true,
    default: () => "false",
  })
  is_job_guarantee: boolean | null;

  @Column("integer", { name: "total" })
  total: number;

  @Column("numeric", {
    name: "duration",
    nullable: true,
    precision: 5,
    scale: 2,
  })
  duration: number | null;

  @Column("integer", { name: "installment", nullable: true })
  installment: number | null;

  @Column("character varying", {
    name: "shining_sheet",
    nullable: true,
    length: 255,
  })
  shining_sheet: string | null;

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

  @Column("character varying", { name: "banner", nullable: true, length: 100 })
  banner: string | null;

  @OneToMany(
    () => AdmissionSubcourse,
    (admission_subcourse) => admission_subcourse.subcourse
  )
  admission_subcourses: AdmissionSubcourse[];

  @OneToMany(
    () => AdmissionSubcourseFees,
    (admission_subcourse_fees) => admission_subcourse_fees.subcourse
  )
  admission_subcourse_fees: AdmissionSubcourseFees[];

  @OneToMany(
    () => AdmissionTransfer,
    (admissionTransfer) => admissionTransfer.subcourse
  )
  admissionTransfers: AdmissionTransfer[];

  @OneToMany(() => Batches, (batches) => batches.subcourse)
  batches: Batches[];

  @OneToMany(
    () => PackageSubcourses,
    (package_subcourses) => package_subcourses.subcourse
  )
  package_subcourses: PackageSubcourses[];

  @OneToMany(
    () => ShiningSheetTopic,
    (shining_sheet_topic) => shining_sheet_topic.subcourse
  )
  shining_sheet_topics: ShiningSheetTopic[];

  @OneToMany(() => SubcourseFees, (subcourse_fees) => subcourse_fees.subcourse)
  subcourse_fees: SubcourseFees[];

  @OneToMany(
    () => SubcourseTopics,
    (subcourseTopics) => subcourseTopics.subcourse
  )
  subcourseTopics: SubcourseTopics[];

  @ManyToOne(() => CourseConfigs, (courseConfigs) => courseConfigs.subcourses)
  @JoinColumn([{ name: "course_config_id", referencedColumnName: "id" }])
  courseConfig: CourseConfigs;

  @ManyToOne(() => Course, (course) => course.subcourses, {
    onDelete: "CASCADE"
  })
  @JoinColumn([{ name: "course_id", referencedColumnName: "id" }])
  course: Course;

  @OneToMany(
    () => TemplateShiningSheet,
    (templateShiningSheet) => templateShiningSheet.subcourse
  )
  templateShiningSheets: TemplateShiningSheet[];
}