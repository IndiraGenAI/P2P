import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Admissions } from "./admissions";
import { Batches } from "./batches";
import { Branches } from "./branches";
import { Subcourses } from "./subcourses";

@Index("admission_transfer_pkey", ["id"], { unique: true })
@Entity("admission_transfer", { schema: "public" })
export class AdmissionTransfer {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "admission_id" })
  admission_id: number;

  @Column("integer", { name: "branch_in_id" })
  branch_in_id: number;

  @Column("integer", { name: "branch_out_id" })
  branch_out_id: number;

  @Column("integer", { name: "subcourse_id" })
  subcourse_id: number;

  @Column("integer", { name: "batch_id" })
  batch_id: number;

  @Column("text", { name: "comment", nullable: true })
  comment: string | null;

  @Column("text", { name: "rejected_comment", nullable: true })
  rejectedComment: string | null;

  @Column("date", { name: "rejected_date", nullable: true })
  rejected_date: string | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["INITIALIZE", "ABOT", "ACCEPT", "REJECT"],
  })
  status: "INITIALIZE" | "ABOT" | "ACCEPT" | "REJECT" | null;

  @Column("character varying", {
    name: "created_by",
    nullable: true,
    length: 100,
  })
  created_by: string | null;

  @Column("timestamp without time zone", {
    name: "created_date",
    nullable: true,
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

  @ManyToOne(() => Admissions, (admissions) => admissions.admissionTransfers, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "admission_id", referencedColumnName: "id" }])
  admission: Admissions;

  @ManyToOne(() => Batches, (batches) => batches.admissionTransfers, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "batch_id", referencedColumnName: "id" }])
  batch: Batches;

  @ManyToOne(() => Branches, (branches) => branches.admissionTransfers, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "branch_in_id", referencedColumnName: "id" }])
  branchIn: Branches;

  @ManyToOne(() => Branches, (branches) => branches.admissionTransfers2, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "branch_out_id", referencedColumnName: "id" }])
  branchOut: Branches;

  @ManyToOne(() => Subcourses, (subcourses) => subcourses.admissionTransfers, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "subcourse_id", referencedColumnName: "id" }])
  subcourse: Subcourses;
}
