import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApprovalWorkflowV2 } from "./approval-workflow-v2";
import { ApprovalWorkflowV2StepUser } from "./approval-workflow-v2-step-user";

@Index("approval_workflow_v2_step_pkey", ["id"], { unique: true })
@Index(
  "uq_approval_workflow_v2_step_order",
  ["approval_workflow_v2_id", "sort_order"],
  { unique: true },
)
@Entity("approval_workflow_v2_step", { schema: "public" })
export class ApprovalWorkflowV2Step {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "approval_workflow_v2_id" })
  approval_workflow_v2_id: number;

  @ManyToOne(() => ApprovalWorkflowV2, (w) => w.steps, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "approval_workflow_v2_id", referencedColumnName: "id" }])
  workflow: ApprovalWorkflowV2;

  @Column("integer", { name: "sort_order" })
  sort_order: number;

  @Column("character varying", { name: "step_role", length: 20 })
  step_role: string;

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

  @OneToMany(() => ApprovalWorkflowV2StepUser, (u) => u.step, {
    cascade: true,
  })
  step_users: ApprovalWorkflowV2StepUser[];
}
