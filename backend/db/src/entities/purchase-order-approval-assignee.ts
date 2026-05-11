import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./users";
import { PurchaseOrderApprovalStep } from "./purchase-order-approval-step";

@Index("purchase_order_approval_assignee_pkey", ["id"], { unique: true })
@Index("uq_po_approval_assignee_step_user", [
  "purchase_order_approval_step_id",
  "user_id",
], { unique: true })
@Entity("purchase_order_approval_assignee", { schema: "public" })
export class PurchaseOrderApprovalAssignee {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "purchase_order_approval_step_id" })
  purchase_order_approval_step_id: number;

  @ManyToOne(() => PurchaseOrderApprovalStep, (s) => s.assignees, {
    onDelete: "CASCADE",
  })
  @JoinColumn([
    {
      name: "purchase_order_approval_step_id",
      referencedColumnName: "id",
    },
  ])
  approval_step: PurchaseOrderApprovalStep;

  @Column("integer", { name: "user_id" })
  user_id: number;

  @ManyToOne(() => Users, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
