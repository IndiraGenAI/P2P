import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Branches } from "./branches";
import { Departments } from "./departments";

@Index("branch_departments_pkey", ["id"], { unique: true })
@Entity("branch_departments", { schema: "public" })
export class BranchDepartments {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "branch_id"})
  branch_id: number;

  @Column("integer", { name: "department_id"})
  department_id: number;

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

  @ManyToOne(() => Branches, (branches) => branches.branch_departments)
  @JoinColumn([{ name: "branch_id", referencedColumnName: "id" }])
  branch: Branches;

  @ManyToOne(() => Departments, (departments) => departments.branch_departments)
  @JoinColumn([{ name: "department_id", referencedColumnName: "id" }])
  department: Departments;
}
