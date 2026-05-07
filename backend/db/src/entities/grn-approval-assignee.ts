import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./users";
import { GrnApprovalStep } from "./grn-approval-step";

@Index("grn_approval_assignee_pkey", ["id"], { unique: true })
@Index("uq_grn_approval_assignee_step_user", ["grn_approval_step_id", "user_id"], {
  unique: true,
})
@Entity("grn_approval_assignee", { schema: "public" })
export class GrnApprovalAssignee {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "grn_approval_step_id" })
  grn_approval_step_id: number;

  @ManyToOne(() => GrnApprovalStep, (s) => s.assignees, {
    onDelete: "CASCADE",
  })
  @JoinColumn([
    {
      name: "grn_approval_step_id",
      referencedColumnName: "id",
    },
  ])
  approval_step: GrnApprovalStep;

  @Column("integer", { name: "user_id" })
  user_id: number;

  @ManyToOne(() => Users, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
