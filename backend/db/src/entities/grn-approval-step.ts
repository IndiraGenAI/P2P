import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApprovalWorkflowStep } from "./approval-workflow-step";
import { Grn } from "./grn";
import { GrnApprovalAssignee } from "./grn-approval-assignee";

export type GrnApprovalStepStatus = "PENDING" | "APPROVED" | "REJECTED";

@Index("grn_approval_step_pkey", ["id"], { unique: true })
@Index("uq_grn_approval_step_grn_seq", ["grn_id", "sequence_order"], {
  unique: true,
})
@Entity("grn_approval_step", { schema: "public" })
export class GrnApprovalStep {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "grn_id" })
  grn_id: number;

  @ManyToOne(() => Grn, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "grn_id", referencedColumnName: "id" }])
  grn: Grn;

  @Column("integer", { name: "sequence_order" })
  sequence_order: number;

  @Column("integer", { name: "approval_workflow_step_id", nullable: true })
  approval_workflow_step_id: number | null;

  @ManyToOne(() => ApprovalWorkflowStep, { onDelete: "SET NULL", nullable: true })
  @JoinColumn([
    { name: "approval_workflow_step_id", referencedColumnName: "id" },
  ])
  approval_workflow_step: ApprovalWorkflowStep | null;

  @Column("character varying", { name: "step_role", length: 20 })
  step_role: string;

  @Column("character varying", {
    name: "status",
    length: 20,
    default: () => "'PENDING'",
  })
  status: GrnApprovalStepStatus;

  @Column("integer", { name: "acted_by_user_id", nullable: true })
  acted_by_user_id: number | null;

  @Column("timestamp without time zone", {
    name: "acted_at",
    nullable: true,
  })
  acted_at: Date | null;

  @Column("text", { name: "remarks", nullable: true })
  remarks: string | null;

  @OneToMany(() => GrnApprovalAssignee, (a) => a.approval_step, {
    cascade: true,
  })
  assignees: GrnApprovalAssignee[];
}
