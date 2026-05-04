import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApprovalWorkflowTier } from "./approval-workflow-tier";
import { ApprovalWorkflowStepUser } from "./approval-workflow-step-user";

@Index("approval_workflow_step_pkey", ["id"], { unique: true })
@Index("uq_approval_workflow_step_order", ["approval_workflow_tier_id", "sort_order"], {
  unique: true,
})
@Entity("approval_workflow_step", { schema: "public" })
export class ApprovalWorkflowStep {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "approval_workflow_tier_id" })
  approval_workflow_tier_id: number;

  @ManyToOne(() => ApprovalWorkflowTier, (t) => t.steps, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "approval_workflow_tier_id", referencedColumnName: "id" }])
  tier: ApprovalWorkflowTier;

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

  @OneToMany(() => ApprovalWorkflowStepUser, (u) => u.step, {
    cascade: true,
  })
  step_users: ApprovalWorkflowStepUser[];
}
