import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PurchaseRequest } from "./purchase-request";
import { ApprovalWorkflowStep } from "./approval-workflow-step";
import { PurchaseRequestApprovalAssignee } from "./purchase-request-approval-assignee";

export type PurchaseRequestApprovalStepStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

@Index("purchase_request_approval_step_pkey", ["id"], { unique: true })
@Index("uq_pr_approval_step_pr_seq", ["purchase_request_id", "sequence_order"], {
  unique: true,
})
@Entity("purchase_request_approval_step", { schema: "public" })
export class PurchaseRequestApprovalStep {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "purchase_request_id" })
  purchase_request_id: number;

  @ManyToOne(() => PurchaseRequest, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "purchase_request_id", referencedColumnName: "id" }])
  purchase_request: PurchaseRequest;

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
  status: PurchaseRequestApprovalStepStatus;

  @Column("integer", { name: "acted_by_user_id", nullable: true })
  acted_by_user_id: number | null;

  @Column("timestamp without time zone", {
    name: "acted_at",
    nullable: true,
  })
  acted_at: Date | null;

  @Column("text", { name: "remarks", nullable: true })
  remarks: string | null;

  @OneToMany(() => PurchaseRequestApprovalAssignee, (a) => a.approval_step, {
    cascade: true,
  })
  assignees: PurchaseRequestApprovalAssignee[];
}
