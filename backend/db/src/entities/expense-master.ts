import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Departments } from "./departments";

@Index("expense_master_pkey", ["id"], { unique: true })
@Entity("expense_master", { schema: "public" })
export class ExpenseMaster {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "department_id", nullable: true })
  department_id: number | null;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

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

  @ManyToOne(() => Departments, (departments) => departments.expenseMasters)
  @JoinColumn([{ name: "department_id", referencedColumnName: "id" }])
  department: Departments;

}
