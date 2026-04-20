import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Admissions } from "./admissions";
import { Lookups } from "./lookups";
import { Invoices } from "./invoices";

@Index("invoice_fees_pkey", ["id"], { unique: true })
@Entity("invoice_fees", { schema: "public" })
export class InvoiceFees {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "admission_id"})
  admission_id: number

  @Column("integer", { name: "fee_type_id"})
  fee_type_id: number

  @Column("integer", { name: "invoice_id"})
  invoice_id: number

  @Column("numeric", {
    name: "amount",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => 0,
  })
  amount: number | null;

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

  @ManyToOne(() => Admissions, (admissions) => admissions.invoice_fees)
  @JoinColumn([{ name: "admission_id", referencedColumnName: "id" }])
  admission: Admissions;

  @ManyToOne(() => Lookups, (lookups) => lookups.invoice_fees)
  @JoinColumn([{ name: "fee_type_id", referencedColumnName: "id" }])
  fee_type: Lookups;

  @ManyToOne(() => Invoices, (invoices) => invoices.invoice_fees)
  @JoinColumn([{ name: "invoice_id", referencedColumnName: "id" }])
  invoice: Invoices;
}
