import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./users";
import { RateContractApprovalStep } from "./rate-contract-approval-step";

@Index("rate_contract_approval_assignee_pkey", ["id"], { unique: true })
@Index(
  "uq_rc_approval_assignee_step_user",
  ["rate_contract_approval_step_id", "user_id"],
  { unique: true },
)
@Entity("rate_contract_approval_assignee", { schema: "public" })
export class RateContractApprovalAssignee {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "rate_contract_approval_step_id" })
  rate_contract_approval_step_id: number;

  @ManyToOne(() => RateContractApprovalStep, (s) => s.assignees, {
    onDelete: "CASCADE",
  })
  @JoinColumn([
    {
      name: "rate_contract_approval_step_id",
      referencedColumnName: "id",
    },
  ])
  approval_step: RateContractApprovalStep;

  @Column("integer", { name: "user_id" })
  user_id: number;

  @ManyToOne(() => Users, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
