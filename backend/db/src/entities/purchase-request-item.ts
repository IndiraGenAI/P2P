import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PurchaseRequest } from "./purchase-request";
import { Item } from "./item";

@Index("purchase_request_items_pkey", ["id"], { unique: true })
@Entity("purchase_request_items", { schema: "public" })
export class PurchaseRequestItem {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "purchase_request_id" })
  purchase_request_id: number;

  @Column("integer", { name: "item_id", nullable: true })
  item_id: number | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

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

  @ManyToOne(() => PurchaseRequest, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "purchase_request_id", referencedColumnName: "id" }])
  purchase_request: PurchaseRequest;

  @ManyToOne(() => Item, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "item_id", referencedColumnName: "id" }])
  item: Item | null;
}
