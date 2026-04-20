import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Course } from "./course";
import { Packages } from "./packages";
import { Departments } from "./departments";
import { Admissions } from "./admissions";

@Index("code_subdepartments_unique", ["code"], { unique: true })
@Index("subdepartments_pkey", ["id"], { unique: true })
@Index("name_subdepartments_unique", ["name"], { unique: true })
@Entity("subdepartments", { schema: "public" })
export class Subdepartments {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "department_id"})
  department_id: number;

  @Column("character varying", { name: "name", unique: true, length: 100 })
  name: string;

  @Column("character varying", { name: "code", unique: true, length: 50 })
  code: string;

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

  @OneToMany(() => Admissions, (admissions) => admissions.subdepartment)
  admissions: Admissions[];

  @OneToMany(() => Course, (course) => course.subdepartment)
  courses: Course[];

  @OneToMany(() => Packages, (packages) => packages.subdepartment)
  packages: Packages[];

  @ManyToOne(() => Departments, (departments) => departments.subdepartments)
  @JoinColumn([{ name: "department_id", referencedColumnName: "id" }])
  department: Departments;
}
