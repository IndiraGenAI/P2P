import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./users";
import { PurchaseRequestApprovalStep } from "./purchase-request-approval-step";

@Index("purchase_request_approval_assignee_pkey", ["id"], { unique: true })
@Index("uq_pr_approval_assignee_step_user", [
  "purchase_request_approval_step_id",
  "user_id",
], { unique: true })
@Entity("purchase_request_approval_assignee", { schema: "public" })
export class PurchaseRequestApprovalAssignee {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "purchase_request_approval_step_id" })
  purchase_request_approval_step_id: number;

  @ManyToOne(() => PurchaseRequestApprovalStep, (s) => s.assignees, {
    onDelete: "CASCADE",
  })
  @JoinColumn([
    {
      name: "purchase_request_approval_step_id",
      referencedColumnName: "id",
    },
  ])
  approval_step: PurchaseRequestApprovalStep;

  @Column("integer", { name: "user_id" })
  user_id: number;

  @ManyToOne(() => Users, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
