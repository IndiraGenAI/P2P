import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Center } from "./center";
import { Gst } from "./gst";
import { Grn } from "./grn";
import { Item } from "./item";

@Index("grn_items_pkey", ["id"], { unique: true })
@Entity("grn_items", { schema: "public" })
export class GrnItem {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "grn_id" })
  grn_id: number;

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

  @ManyToOne(() => Grn, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "grn_id", referencedColumnName: "id" }])
  grn: Grn;

  @ManyToOne(() => Item, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "item_id", referencedColumnName: "id" }])
  item: Item | null;

  @ManyToOne(() => Center, { onDelete: "RESTRICT" })
  @JoinColumn([{ name: "center_id", referencedColumnName: "id" }])
  center: Center;

  @ManyToOne(() => Gst, { onDelete: "SET NULL", nullable: true })
  @JoinColumn([{ name: "gst_id", referencedColumnName: "id" }])
  gst: Gst | null;
}
