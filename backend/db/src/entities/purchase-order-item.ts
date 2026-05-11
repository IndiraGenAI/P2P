import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PurchaseOrder } from "./purchase-order";
import { Item } from "./item";
import { Center } from "./center";
import { Gst } from "./gst";
import { Coa } from "./coa";

@Index("purchase_order_items_pkey", ["id"], { unique: true })
@Entity("purchase_order_items", { schema: "public" })
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "purchase_order_id" })
  purchase_order_id: number;

  @Column("integer", { name: "item_id", nullable: true })
  item_id: number | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("integer", { name: "center_id", nullable: true })
  center_id: number | null;

  @Column("numeric", {
    name: "quantity",
    precision: 12,
    scale: 2,
    default: () => "1",
  })
  quantity: string;

  @Column("numeric", {
    name: "estimated_rate",
    precision: 12,
    scale: 2,
    default: () => "0",
  })
  estimated_rate: string;

  @Column("numeric", {
    name: "amount",
    precision: 12,
    scale: 2,
    default: () => "0",
  })
  amount: string;

  @Column("integer", { name: "gst_id", nullable: true })
  gst_id: number | null;

  @Column("numeric", {
    name: "gst_amount",
    nullable: true,
    precision: 12,
    scale: 2,
    default: () => "0",
  })
  gst_amount: string | null;

  @Column("numeric", {
    name: "net_line_amount",
    nullable: true,
    precision: 12,
    scale: 2,
    default: () => "0",
  })
  net_line_amount: string | null;

  @Column("integer", { name: "coa_id", nullable: true })
  coa_id: number | null;

  @Column("text", { name: "remarks", nullable: true })
  remarks: string | null;

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

  @ManyToOne(() => PurchaseOrder, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "purchase_order_id", referencedColumnName: "id" }])
  purchase_order: PurchaseOrder;

  @ManyToOne(() => Item, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "item_id", referencedColumnName: "id" }])
  item: Item | null;

  @ManyToOne(() => Center, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "center_id", referencedColumnName: "id" }])
  center: Center | null;

  @ManyToOne(() => Gst, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "gst_id", referencedColumnName: "id" }])
  gst: Gst | null;

  @ManyToOne(() => Coa, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "coa_id", referencedColumnName: "id" }])
  coa: Coa | null;
}
