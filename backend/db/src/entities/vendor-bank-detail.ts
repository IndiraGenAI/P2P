import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Vendor } from "./vendor";

@Index("vendor_bank_details_pkey", ["id"], { unique: true })
@Entity("vendor_bank_details", { schema: "public" })
export class VendorBankDetail {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "vendor_id" })
  vendor_id: number;

  @Column("character varying", { name: "account_number", nullable: true, length: 50 })
  account_number: string | null;

  @Column("character varying", { name: "bank_name", nullable: true, length: 100 })
  bank_name: string | null;

  @Column("character varying", { name: "branch_name", nullable: true, length: 100 })
  branch_name: string | null;

  @Column("character varying", { name: "ifsc_code", nullable: true, length: 20 })
  ifsc_code: string | null;

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
}
