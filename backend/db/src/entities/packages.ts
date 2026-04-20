import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PackageBranches } from "./package-branches";
import { PackageFees } from "./package-fees";
import { PackageSubcourses } from "./package-subcourses";
import { CourseConfigs } from "./course-configs";
import { Departments } from "./departments";
import { Subdepartments } from "./subdepartments";
import { Admissions } from "./admissions";
import { AdmissionSubcourse } from "./admission-subcourse";
import { AdmissionPackageFees } from "./admission-package-fees";
import { AdmissionPackages } from "./admission-packages";

@Index("packages_code_key", ["code"], { unique: true })
@Index("packages_pkey", ["id"], { unique: true })
@Index("packages_name_key", ["name"], { unique: true })
@Entity("packages", { schema: "public" })
export class Packages {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "course_config_id" })
  course_config_id: number;

  @Column("integer", { name: "department_id" })
  department_id: number;

  @Column("integer", { name: "subdepartment_id" })
  subdepartment_id: number;

  @Column("character varying", {
    name: "name",
    nullable: true,
    unique: true,
    length: 100,
  })
  name: string | null;

  @Column("character varying", {
    name: "code",
    nullable: true,
    unique: true,
    length: 100,
  })
  code: string | null;

  @Column("boolean", {
    name: "is_job_guarantee",
    nullable: true,
    default: () => "false",
  })
  is_job_guarantee: boolean | null;

  @Column("integer", { name: "total", nullable: true })
  total: number | null;

  @Column("numeric", {
    name: "duration",
    nullable: true,
    precision: 5,
    scale: 2,
  })
  duration: number | null;

  @Column("integer", { name: "installment", nullable: true })
  installment: number | null;

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
    () => AdmissionPackageFees,
    (admission_package_fees) => admission_package_fees.package
  )
  admission_package_fees: AdmissionPackageFees[];

  @OneToMany(
    () => AdmissionPackages,
    (admission_packages) => admission_packages.package
  )
  admission_packages: AdmissionPackages[];

  @OneToMany(
    () => AdmissionSubcourse,
    (admission_subcourse) => admission_subcourse.package
  )
  admission_subcourses: AdmissionSubcourse[];

  @OneToMany(() => Admissions, (admissions) => admissions.package)
  admissions: Admissions[];

  @OneToMany(
    () => PackageBranches,
    (package_branches) => package_branches.package
  )
  package_branches: PackageBranches[];

  @OneToMany(() => PackageFees, (package_fees) => package_fees.package)
  package_fees: PackageFees[];

  @OneToMany(
    () => PackageSubcourses,
    (package_subcourses) => package_subcourses.package
  )
  package_subcourses: PackageSubcourses[];

  @ManyToOne(() => CourseConfigs, (courseConfigs) => courseConfigs.packages)
  @JoinColumn([{ name: "course_config_id", referencedColumnName: "id" }])
  courseConfig: CourseConfigs;

  @ManyToOne(() => Departments, (departments) => departments.packages)
  @JoinColumn([{ name: "department_id", referencedColumnName: "id" }])
  department: Departments;

  @ManyToOne(() => Subdepartments, (subdepartments) => subdepartments.packages)
  @JoinColumn([{ name: "subdepartment_id", referencedColumnName: "id" }])
  subdepartment: Subdepartments;
}
