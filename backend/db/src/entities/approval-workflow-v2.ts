import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApprovalWorkflowV2Step } from "./approval-workflow-v2-step";

/** Single approval chain per scope (ITEM / VENDOR / BUDGET). */
@Index("approval_workflow_v2_pkey", ["id"], { unique: true })
@Index("uq_approval_workflow_v2_scope", ["scope"], { unique: true })
@Entity("approval_workflow_v2", { schema: "public" })
export class ApprovalWorkflowV2 {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "scope", length: 20 })
  scope: string;

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
  })
  updated_date: Date | null;

  @OneToMany(() => ApprovalWorkflowV2Step, (s) => s.workflow, {
    cascade: true,
  })
  steps: ApprovalWorkflowV2Step[];
}
