import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RateContract } from "./rate-contract";
import { ApprovalWorkflowStep } from "./approval-workflow-step";
import { RateContractApprovalAssignee } from "./rate-contract-approval-assignee";

export type RateContractApprovalStepStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

@Index("rate_contract_approval_step_pkey", ["id"], { unique: true })
@Index("uq_rc_approval_step_rc_seq", ["rate_contract_id", "sequence_order"], {
  unique: true,
})
@Entity("rate_contract_approval_step", { schema: "public" })
export class RateContractApprovalStep {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "rate_contract_id" })
  rate_contract_id: number;

  @ManyToOne(() => RateContract, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "rate_contract_id", referencedColumnName: "id" }])
  rate_contract: RateContract;

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
  status: RateContractApprovalStepStatus;

  @Column("integer", { name: "acted_by_user_id", nullable: true })
  acted_by_user_id: number | null;

  @Column("timestamp without time zone", {
    name: "acted_at",
    nullable: true,
  })
  acted_at: Date | null;

  @Column("text", { name: "remarks", nullable: true })
  remarks: string | null;

  @OneToMany(() => RateContractApprovalAssignee, (a) => a.approval_step, {
    cascade: true,
  })
  assignees: RateContractApprovalAssignee[];
}
