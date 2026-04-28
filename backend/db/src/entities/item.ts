import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ItemCategory } from "./item-category";
import { ItemType } from "./item-type";
import { Uom } from "./uom";
import { Coa } from "./coa";

@Index("items_pkey", ["id"], { unique: true })
@Index("items_code_key", ["code"], { unique: true })
@Entity("items", { schema: "public" })
export class Item {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "code", length: 50 })
  code: string;

  @Column("character varying", { name: "name", length: 150 })
  name: string;

  @Column("integer", { name: "item_type_id", nullable: true })
  item_type_id: number | null;

  @Column("integer", { name: "item_category_id", nullable: true })
  item_category_id: number | null;

  @Column("integer", { name: "uom_id", nullable: true })
  uom_id: number | null;

  @Column("integer", { name: "coa_id", nullable: true })
  coa_id: number | null;

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
    default: () => "CURRENT_TIMESTAMP",
  })
  updated_date: Date | null;

  @ManyToOne(() => ItemType, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "item_type_id", referencedColumnName: "id" }])
  item_type: ItemType | null;

  @ManyToOne(() => ItemCategory, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "item_category_id", referencedColumnName: "id" }])
  item_category: ItemCategory | null;

  @ManyToOne(() => Uom, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "uom_id", referencedColumnName: "id" }])
  uom: Uom | null;

  @ManyToOne(() => Coa, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "coa_id", referencedColumnName: "id" }])
  coa: Coa | null;
}
