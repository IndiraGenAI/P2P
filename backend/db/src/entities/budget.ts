import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Center } from "./center";
import { Coa } from "./coa";
import { CostCenter } from "./cost-center";
import { Department } from "./department";
import { EntityMaster } from "./entity-master";
import { Subdepartment } from "./subdepartment";

@Index("budgets_pkey", ["id"], { unique: true })
@Entity("budgets", { schema: "public" })
export class Budget {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "financial_year", length: 20 })
  financial_year: string;

  @Column("character varying", { name: "budget_type", length: 20 })
  budget_type: string;

  @Column("integer", { name: "coa_id" })
  coa_id: number;

  @Column("integer", { name: "department_id" })
  department_id: number;

  @Column("integer", { name: "subdepartment_id" })
  subdepartment_id: number;

  @Column("integer", { name: "entity_id" })
  entity_id: number;

  @Column("integer", { name: "center_id" })
  center_id: number;

  @Column("integer", { name: "cost_center_id" })
  cost_center_id: number;

  @Column("numeric", {
    name: "amount",
    precision: 18,
    scale: 2,
    default: () => "0",
  })
  amount: string;

  @Column("numeric", {
    name: "consumed_amount",
    precision: 18,
    scale: 2,
    default: () => "0",
  })
  consumed_amount: string;

  @Column("numeric", {
    name: "balance_amount",
    precision: 18,
    scale: 2,
    default: () => "0",
  })
  balance_amount: string;

  @Column("character varying", { name: "control_type", length: 30 })
  control_type: string;

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

  @ManyToOne(() => Coa, { onDelete: "RESTRICT" })
  @JoinColumn([{ name: "coa_id", referencedColumnName: "id" }])
  coa: Coa;

  @ManyToOne(() => Department, { onDelete: "RESTRICT" })
  @JoinColumn([{ name: "department_id", referencedColumnName: "id" }])
  department: Department;

  @ManyToOne(() => Subdepartment, { onDelete: "RESTRICT" })
  @JoinColumn([{ name: "subdepartment_id", referencedColumnName: "id" }])
  subdepartment: Subdepartment;

  @ManyToOne(() => EntityMaster, { onDelete: "RESTRICT" })
  @JoinColumn([{ name: "entity_id", referencedColumnName: "id" }])
  entity: EntityMaster;

  @ManyToOne(() => Center, { onDelete: "RESTRICT" })
  @JoinColumn([{ name: "center_id", referencedColumnName: "id" }])
  center: Center;

  @ManyToOne(() => CostCenter, { onDelete: "RESTRICT" })
  @JoinColumn([{ name: "cost_center_id", referencedColumnName: "id" }])
  cost_center: CostCenter;
}
