import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Admissions } from "./admissions";
import { Packages } from "./packages";

@Index("admission_packages_pkey", ["id"], { unique: true })
@Entity("admission_packages", { schema: "public" })
export class AdmissionPackages {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "admission_id"})
  admission_id: number

  @Column("integer", { name: "package_id"})
  package_id: number

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
  duration: string | null;

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

  @ManyToOne(() => Admissions, (admissions) => admissions.admission_packages)
  @JoinColumn([{ name: "admission_id", referencedColumnName: "id" }])
  admission: Admissions;

  @ManyToOne(() => Packages, (packages) => packages.admission_packages)
  @JoinColumn([{ name: "package_id", referencedColumnName: "id" }])
  package: Packages;
}
