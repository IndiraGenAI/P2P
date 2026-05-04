import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Center } from "./center";
import { EntityMaster } from "./entity-master";
import { Subdepartment } from "./subdepartment";
import { ApprovalWorkflowTier } from "./approval-workflow-tier";

/** Nullable center_id means the workflow applies to all centers (default). */
@Index("approval_workflow_pkey", ["id"], { unique: true })
@Index("idx_approval_workflow_scope", [
  "entity_id",
  "transaction_type",
  "subdepartment_id",
])
@Entity("approval_workflow", { schema: "public" })
export class ApprovalWorkflow {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "entity_id" })
  entity_id: number;

  @ManyToOne(() => EntityMaster, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "entity_id", referencedColumnName: "id" }])
  entity: EntityMaster;

  @Column("character varying", { name: "transaction_type", length: 50 })
  transaction_type: string;

  @Column("integer", { name: "subdepartment_id" })
  subdepartment_id: number;

  @ManyToOne(() => Subdepartment, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "subdepartment_id", referencedColumnName: "id" }])
  subdepartment: Subdepartment;

  @Column("integer", { name: "center_id", nullable: true })
  center_id: number | null;

  @ManyToOne(() => Center, { onDelete: "CASCADE", nullable: true })
  @JoinColumn([{ name: "center_id", referencedColumnName: "id" }])
  center: Center | null;

  @Column("boolean", { name: "status", nullable: true, default: () => "true" })
  status: boolean | null;

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

  @OneToMany(() => ApprovalWorkflowTier, (tier) => tier.workflow, {
    cascade: true,
  })
  tiers: ApprovalWorkflowTier[];
}
