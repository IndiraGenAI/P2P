import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Vendor } from "./vendor";

@Index("vendor_sites_pkey", ["id"], { unique: true })
@Entity("vendor_sites", { schema: "public" })
export class VendorSite {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "vendor_id" })
  vendor_id: number;

  @Column("character varying", { name: "site_code", length: 50 })
  site_code: string;

  @Column("character varying", {
    name: "site_name",
    nullable: true,
    length: 150,
  })
  site_name: string | null;

  @Column("text", { name: "address", nullable: true })
  address: string | null;

  @Column("character varying", {
    name: "contact_person",
    nullable: true,
    length: 100,
  })
  contact_person: string | null;

  @Column("character varying", {
    name: "contact_phone",
    nullable: true,
    length: 20,
  })
  contact_phone: string | null;

  @Column("character varying", {
    name: "contact_email",
    nullable: true,
    length: 100,
  })
  contact_email: string | null;

  @Column("character varying", {
    name: "supplier_site_name",
    nullable: true,
    length: 150,
  })
  supplier_site_name: string | null;

  @Column("character varying", {
    name: "oracle_address_name",
    nullable: true,
    length: 150,
  })
  oracle_address_name: string | null;

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

  @ManyToOne(() => Vendor, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "vendor_id", referencedColumnName: "id" }])
  vendor: Vendor;
}
