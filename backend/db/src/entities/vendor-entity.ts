import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Vendor } from "./vendor";
import { EntityMaster } from "./entity-master";

@Index("vendor_entities_pkey", ["id"], { unique: true })
@Index("unique_vendor_entity", ["vendor_id", "entity_id"], { unique: true })
@Entity("vendor_entities", { schema: "public" })
export class VendorEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "vendor_id" })
  vendor_id: number;

  @Column("integer", { name: "entity_id" })
  entity_id: number;

  @Column("boolean", { name: "status", nullable: true, default: () => "true" })
  status: boolean | null;

  @Column("character varying", { name: "created_by", nullable: true, length: 100 })
  created_by: string | null;

  @Column("timestamp without time zone", {
    name: "created_date",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  created_date: Date | null;

  @Column("character varying", { name: "updated_by", nullable: true, length: 100 })
  updated_by: string | null;

  @Column("timestamp without time zone", {
    name: "updated_date",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updated_date: Date | null;

  @ManyToOne(() => Vendor, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "vendor_id", referencedColumnName: "id" }])
  vendor: Vendor;

  @ManyToOne(() => EntityMaster, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "entity_id", referencedColumnName: "id" }])
  entity: EntityMaster;
}
