import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Department } from "./department";

@Index("subdepartments_pkey", ["id"], { unique: true })
@Index("unique_subdepartment_code", ["code"], { unique: true })
@Index("unique_subdepartment_name", ["department_id", "name"], { unique: true })
@Entity("subdepartments", { schema: "public" })
export class Subdepartment {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "department_id" })
  department_id: number;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("character varying", { name: "code", length: 50 })
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
    default: () => "CURRENT_TIMESTAMP",
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
    default: () => "CURRENT_TIMESTAMP",
  })
  updated_date: Date | null;

  @ManyToOne(() => Department, (department) => department.subdepartments, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "department_id", referencedColumnName: "id" }])
  department: Department;
}
