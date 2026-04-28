import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Vendor } from "./vendor";

@Index("vendor_documents_pkey", ["id"], { unique: true })
@Entity("vendor_documents", { schema: "public" })
export class VendorDocument {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "vendor_id" })
  vendor_id: number;

  @Column("character varying", { name: "file_name", length: 255 })
  file_name: string;

  @Column("character varying", { name: "file_url", length: 500 })
  file_url: string;

  @Column("integer", { name: "file_size", nullable: true })
  file_size: number | null;

  @Column("character varying", { name: "mime_type", nullable: true, length: 100 })
  mime_type: string | null;

  @Column("character varying", { name: "description", nullable: true, length: 255 })
  description: string | null;

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
