import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Admissions } from "./admissions";
import { Batches } from "./batches";
import { Course } from "./course";
import { Packages } from "./packages";
import { Subcourses } from "./subcourses";
import { Users } from "./users";

@Index("admission_subcourse_pkey", ["id"], { unique: true })
@Entity("admission_subcourse", { schema: "public" })
export class AdmissionSubcourse {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "admission_id" })
  admission_id: number

  @Column("integer", { name: "batch_id" })
  batch_id: number

  @Column("integer", { name: "course_id" })
  course_id: number

  @Column("integer", { name: "package_id" })
  package_id: number

  @Column("integer", { name: "subcourse_id" })
  subcourse_id: number

  @Column("integer", { name: "subcourse_id" })
  user_id: number

  @Column("enum", { name: "course_category", enum: ["SINGLE", "PACKAGE"] })
  course_category: "SINGLE" | "PACKAGE";

  @Column("enum", {
    name: "subcourse_status",
    nullable: true,
    enum: ["ONGOING", "PENDING", "COMPLETED", "CANCELLED", "UP_COMING", "ON_HOLD",
      "ON_VACATION"],
  })
  subcourse_status:
    | "ONGOING"
    | "PENDING"
    | "COMPLETED"
    | "CANCELLED"
    | "UP_COMING"
    | "ON_HOLD"
    | "ON_VACATION"
    | null;

  @Column("date", { name: "assigned_date", nullable: true })
  assigned_date: string | null;

  @Column("date", { name: "completed_date", nullable: true })
  completed_date: string | null;

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

  @ManyToOne(() => Admissions, (admissions) => admissions.admission_subcourses)
  @JoinColumn([{ name: "admission_id", referencedColumnName: "id" }])
  admission: Admissions;

  @ManyToOne(() => Batches, (batches) => batches.admission_subcourses)
  @JoinColumn([{ name: "batch_id", referencedColumnName: "id" }])
  batch: Batches;

  @ManyToOne(() => Course, (course) => course.admission_subcourses)
  @JoinColumn([{ name: "course_id", referencedColumnName: "id" }])
  course: Course;

  @ManyToOne(() => Packages, (packages) => packages.admission_subcourses)
  @JoinColumn([{ name: "package_id", referencedColumnName: "id" }])
  package: Packages;

  @ManyToOne(() => Subcourses, (subcourses) => subcourses.admission_subcourses)
  @JoinColumn([{ name: "subcourse_id", referencedColumnName: "id" }])
  subcourse: Subcourses;

  @ManyToOne(() => Users, (users) => users.admission_subcourses)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
