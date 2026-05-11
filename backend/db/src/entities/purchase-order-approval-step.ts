import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PurchaseOrder } from "./purchase-order";
import { ApprovalWorkflowStep } from "./approval-workflow-step";
import { PurchaseOrderApprovalAssignee } from "./purchase-order-approval-assignee";

export type PurchaseOrderApprovalStepStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

@Index("purchase_order_approval_step_pkey", ["id"], { unique: true })
@Index("uq_po_approval_step_po_seq", ["purchase_order_id", "sequence_order"], {
  unique: true,
})
@Entity("purchase_order_approval_step", { schema: "public" })
export class PurchaseOrderApprovalStep {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "purchase_order_id" })
  purchase_order_id: number;

  @ManyToOne(() => PurchaseOrder, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "purchase_order_id", referencedColumnName: "id" }])
  purchase_order: PurchaseOrder;

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
  status: PurchaseOrderApprovalStepStatus;

  @Column("integer", { name: "acted_by_user_id", nullable: true })
  acted_by_user_id: number | null;

  @Column("timestamp without time zone", {
    name: "acted_at",
    nullable: true,
  })
  acted_at: Date | null;

  @Column("text", { name: "remarks", nullable: true })
  remarks: string | null;

  @OneToMany(() => PurchaseOrderApprovalAssignee, (a) => a.approval_step, {
    cascade: true,
  })
  assignees: PurchaseOrderApprovalAssignee[];
}
