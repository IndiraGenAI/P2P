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
import { GrnInvoice } from "./grn-invoice";
import { GrnInvoiceApprovalAssignee } from "./grn-invoice-approval-assignee";

export type GrnInvoiceApprovalStepStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

@Index("grn_invoice_approval_step_pkey", ["id"], { unique: true })
@Index("uq_grn_inv_appr_seq", ["grn_invoice_id", "sequence_order"], {
  unique: true,
})
@Entity("grn_invoice_approval_step", { schema: "public" })
export class GrnInvoiceApprovalStep {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "grn_invoice_id" })
  grn_invoice_id: number;

  @ManyToOne(() => GrnInvoice, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "grn_invoice_id", referencedColumnName: "id" }])
  grn_invoice: GrnInvoice;

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
  status: GrnInvoiceApprovalStepStatus;

  @Column("integer", { name: "acted_by_user_id", nullable: true })
  acted_by_user_id: number | null;

  @Column("timestamp without time zone", {
    name: "acted_at",
    nullable: true,
  })
  acted_at: Date | null;

  @Column("text", { name: "remarks", nullable: true })
  remarks: string | null;

  @OneToMany(() => GrnInvoiceApprovalAssignee, (a) => a.approval_step, {
    cascade: true,
  })
  assignees: GrnInvoiceApprovalAssignee[];
}
