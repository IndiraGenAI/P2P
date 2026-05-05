import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Center } from "./center";
import { Item } from "./item";
import { RateContract } from "./rate-contract";

@Index("rate_contract_items_pkey", ["id"], { unique: true })
@Entity("rate_contract_items", { schema: "public" })
export class RateContractItem {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "rate_contract_id" })
  rate_contract_id: number;

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

  @ManyToOne(() => RateContract, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "rate_contract_id", referencedColumnName: "id" }])
  rate_contract: RateContract;

  @ManyToOne(() => Item, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "item_id", referencedColumnName: "id" }])
  item: Item | null;

  @ManyToOne(() => Center, { onDelete: "RESTRICT" })
  @JoinColumn([{ name: "center_id", referencedColumnName: "id" }])
  center: Center;
}
