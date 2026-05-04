import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApprovalWorkflow } from "./approval-workflow";
import { ApprovalWorkflowStep } from "./approval-workflow-step";

@Index("approval_workflow_tier_pkey", ["id"], { unique: true })
@Index("uq_approval_workflow_tier_order", ["approval_workflow_id", "sort_order"], {
  unique: true,
})
@Entity("approval_workflow_tier", { schema: "public" })
export class ApprovalWorkflowTier {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "approval_workflow_id" })
  approval_workflow_id: number;

  @ManyToOne(() => ApprovalWorkflow, (w) => w.tiers, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "approval_workflow_id", referencedColumnName: "id" }])
  workflow: ApprovalWorkflow;

  @Column("integer", { name: "sort_order" })
  sort_order: number;

  @Column("numeric", {
    name: "min_amount",
    precision: 18,
    scale: 2,
    default: () => "0",
  })
  min_amount: string;

  @Column("numeric", {
    name: "max_amount",
    precision: 18,
    scale: 2,
    nullable: true,
  })
  max_amount: string | null;

  @Column("character varying", {
    name: "created_by",
    nullable: true,
    length: 100,
  })
  created_by: string | null;

  @Column("timestamp without time zone", {
    name: "created_date",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  created_date: Date | null;

  @Column("character varying", {
    name: "updated_by",
    nullable: true,
    length: 100,
  })
  updated_by: string | null;

  @Column("timestamp without time zone", {
    name: "updated_date",
    nullable: true,
  })
  updated_date: Date | null;

  @OneToMany(() => ApprovalWorkflowStep, (step) => step.tier, {
    cascade: true,
  })
  steps: ApprovalWorkflowStep[];
}
