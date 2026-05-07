import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Center } from "./center";
import { GrnInvoice } from "./grn-invoice";
import { Gst } from "./gst";
import { Item } from "./item";
import { Tds } from "./tds";

@Index("grn_invoice_items_pkey", ["id"], { unique: true })
@Entity("grn_invoice_items", { schema: "public" })
export class GrnInvoiceItem {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "grn_invoice_id" })
  grn_invoice_id: number;

  @Column("integer", { name: "item_id", nullable: true })
  item_id: number | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("integer", { name: "center_id" })
  center_id: number;

  @Column("numeric", {
    name: "quantity",
    precision: 12,
    scale: 2,
    default: () => "1",
  })
  quantity: string;

  @Column("numeric", {
    name: "rate",
    precision: 12,
    scale: 2,
    default: () => "0",
  })
  rate: string;

  @Column("numeric", {
    name: "base_amount",
    precision: 12,
    scale: 2,
    default: () => "0",
  })
  base_amount: string;

  @Column("text", { name: "remarks", nullable: true })
  remarks: string | null;

  @Column("integer", { name: "gst_id", nullable: true })
  gst_id: number | null;

  @Column("integer", { name: "tds_id", nullable: true })
  tds_id: number | null;

  @Column("numeric", {
    name: "gst_amount",
    nullable: true,
    precision: 12,
    scale: 2,
    default: () => "0",
  })
  gst_amount: string | null;

  @Column("numeric", {
    name: "tds_amount",
    nullable: true,
    precision: 12,
    scale: 2,
    default: () => "0",
  })
  tds_amount: string | null;

  @Column("numeric", {
    name: "net_line_amount",
    nullable: true,
    precision: 12,
    scale: 2,
    default: () => "0",
  })
  net_line_amount: string | null;

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
    default: () => "CURRENT_TIMESTAMP",
  })
  updated_date: Date | null;

  @ManyToOne(() => GrnInvoice, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "grn_invoice_id", referencedColumnName: "id" }])
  grn_invoice: GrnInvoice;

  @ManyToOne(() => Item, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "item_id", referencedColumnName: "id" }])
  item: Item | null;

  @ManyToOne(() => Center, { onDelete: "RESTRICT" })
  @JoinColumn([{ name: "center_id", referencedColumnName: "id" }])
  center: Center;

  @ManyToOne(() => Gst, { onDelete: "SET NULL", nullable: true })
  @JoinColumn([{ name: "gst_id", referencedColumnName: "id" }])
  gst: Gst | null;

  @ManyToOne(() => Tds, { onDelete: "SET NULL", nullable: true })
  @JoinColumn([{ name: "tds_id", referencedColumnName: "id" }])
  tds: Tds | null;
}
