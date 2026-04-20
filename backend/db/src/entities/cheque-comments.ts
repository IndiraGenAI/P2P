import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AdmissionInstallments } from "./admission-installments";

@Index("cheque_comments_pkey", ["id"], { unique: true })
@Entity("cheque_comments", { schema: "public" })
export class ChequeComments {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "admission_installments_id"})
  admission_installments_id: number;

  @Column("enum", {
    name: "cheque_status",
    nullable: true,
    enum: [
      "TO_BE_DEPOSIT",
      "TO_BE_COLLECTED",
      "TO_BE_BOUNCE",
      "TO_BE_CLEARED",
      "TO_BE_CANCELED",
    ],
  })
  cheque_status:
    | "TO_BE_DEPOSIT"
    | "TO_BE_COLLECTED"
    | "TO_BE_BOUNCE"
    | "TO_BE_CLEARED"
    | "TO_BE_CANCELED"
    | null;

  @Column("text", { name: "comment", nullable: true })
  comment: string | null;

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

  @ManyToOne(
    () => AdmissionInstallments,
    (admissionInstallments) => admissionInstallments.chequeComments
  )
  @JoinColumn([
    { name: "admission_installments_id", referencedColumnName: "id" },
  ])
  admissionInstallments: AdmissionInstallments;
}
