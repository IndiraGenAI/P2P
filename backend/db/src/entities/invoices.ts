import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Admissions } from "./admissions";
import { Branches } from "./branches";
import { AdmissionInstallments } from "./admission-installments";
import { InvoiceFees } from "./invoice-fees";

@Index("invoices_pkey", ["id"], { unique: true })
@Entity("invoices", { schema: "public" })
export class Invoices {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "admission_id"})
  admission_id: number

  @Column("integer", { name: "branch_id"})
  branch_id: number

  @Column("integer", { name: "installment_id"})
  installment_id: number

  @Column("character varying", {
    name: "invoice_no",
    nullable: true,
    length: 100,
  })
  invoiceNo: string | null;

  @Column("date", { name: "invoice_date", nullable: true })
  invoiceDate: string | null;

  @Column("integer", { name: "pay_amount", nullable: true })
  payAmount: number | null;

  @Column("boolean", { name: "status", nullable: true, default: () => "true" })
  status: boolean | null;

  @Column("boolean", { name: "isgst", nullable: true, default: () => "false" })
  isgst: boolean | null;

  @Column("numeric", { name: "sgst", nullable: true, precision: 10, scale: 2 })
  sgst: number | null;

  @Column("numeric", { name: "cgst", nullable: true, precision: 10, scale: 2 })
  cgst: number | null;
  
  @Column("boolean", {
    name: "iscomposition",
    nullable: true,
    default: () => "false",
  })
  iscomposition: boolean | null;

  @Column("integer", { name: "percentage", nullable: true })
  percentage: number | null;

  @Column("numeric", {
    name: "total_tax",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  total_tax: number | null;

  @Column("character varying", {
    name: "created_by",
    nullable: true,
    length: 100,
  })
  createdBy: string | null;

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
  updatedBy: string | null;

  @Column("timestamp without time zone", {
    name: "updated_date",
    nullable: true,
  })
  updatedDate: Date | null;

  @ManyToOne(() => Admissions, (admissions) => admissions.invoices, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "admission_id", referencedColumnName: "id" }])
  admission: Admissions;

  @ManyToOne(() => Branches, (branches) => branches.invoices, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "branch_id", referencedColumnName: "id" }])
  branch: Branches;

  @ManyToOne(
    () => AdmissionInstallments,
    (admissionInstallments) => admissionInstallments.invoices,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "installment_id", referencedColumnName: "id" }])
  installment: AdmissionInstallments;

  @OneToMany(() => InvoiceFees, (invoice_fees) => invoice_fees.invoice)
  invoice_fees: InvoiceFees[];
}
