import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GrnInvoiceApprovalStep } from "./grn-invoice-approval-step";
import { Users } from "./users";

@Index("grn_invoice_approval_assignee_pkey", ["id"], { unique: true })
@Entity("grn_invoice_approval_assignee", { schema: "public" })
export class GrnInvoiceApprovalAssignee {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "grn_invoice_approval_step_id" })
  grn_invoice_approval_step_id: number;

  @Column("integer", { name: "user_id" })
  user_id: number;

  @ManyToOne(() => GrnInvoiceApprovalStep, (s) => s.assignees, {
    onDelete: "CASCADE",
  })
  @JoinColumn([
    { name: "grn_invoice_approval_step_id", referencedColumnName: "id" },
  ])
  approval_step: GrnInvoiceApprovalStep;

  @ManyToOne(() => Users, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
