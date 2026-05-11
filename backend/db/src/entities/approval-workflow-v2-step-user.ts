import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApprovalWorkflowV2Step } from "./approval-workflow-v2-step";
import { Users } from "./users";

@Index("approval_workflow_v2_step_user_pkey", ["id"], { unique: true })
@Index(
  "uq_approval_workflow_v2_step_user",
  ["approval_workflow_v2_step_id", "user_id"],
  { unique: true },
)
@Entity("approval_workflow_v2_step_user", { schema: "public" })
export class ApprovalWorkflowV2StepUser {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "approval_workflow_v2_step_id" })
  approval_workflow_v2_step_id: number;

  @ManyToOne(() => ApprovalWorkflowV2Step, (s) => s.step_users, {
    onDelete: "CASCADE",
  })
  @JoinColumn([
    { name: "approval_workflow_v2_step_id", referencedColumnName: "id" },
  ])
  step: ApprovalWorkflowV2Step;

  @Column("integer", { name: "user_id" })
  user_id: number;

  @ManyToOne(() => Users, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
