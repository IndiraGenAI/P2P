import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Packages } from "./packages";
import { Subcourses } from "./subcourses";

@Index("course_configs_pkey", ["id"], { unique: true })
@Entity("course_configs", { schema: "public" })
export class CourseConfigs {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

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
  updatedBy: string | null;

  @Column("timestamp without time zone", {
    name: "updated_date",
    nullable: true,
  })
  updated_date: Date | null;

  @OneToMany(() => Packages, (packages) => packages.courseConfig)
  packages: Packages[];

  @OneToMany(() => Subcourses, (subcourses) => subcourses.courseConfig)
  subcourses: Subcourses[];
}
