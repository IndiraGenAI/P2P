import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Vendor } from "./vendor";
import { Center } from "./center";

@Index("vendor_centers_pkey", ["id"], { unique: true })
@Index("unique_vendor_center", ["vendor_id", "center_id"], { unique: true })
@Entity("vendor_centers", { schema: "public" })
export class VendorCenter {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "vendor_id" })
  vendor_id: number;

  @Column("integer", { name: "center_id" })
  center_id: number;

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

  @ManyToOne(() => Center, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "center_id", referencedColumnName: "id" }])
  center: Center;
}
