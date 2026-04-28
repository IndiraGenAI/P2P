import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { VendorCategory } from "./vendor-category";
import { Tds } from "./tds";
import { PaymentTerm } from "./payment-term";
import { ApplicantType } from "./applicant-type";

@Index("vendors_pkey", ["id"], { unique: true })
@Index("vendors_code_key", ["code"], { unique: true })
@Entity("vendors", { schema: "public" })
export class Vendor {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "code", nullable: true, length: 50 })
  code: string | null;

  @Column("character varying", { name: "name", length: 150 })
  name: string;

  @Column("integer", { name: "vendor_category_id", nullable: true })
  vendor_category_id: number | null;

  @Column("character varying", {
    name: "supplier_number",
    nullable: true,
    length: 100,
  })
  supplier_number: string | null;

  @Column("character varying", {
    name: "supplier_name",
    nullable: true,
    length: 150,
  })
  supplier_name: string | null;

  @Column("integer", { name: "tds_id", nullable: true })
  tds_id: number | null;

  @Column("integer", { name: "payment_term_id", nullable: true })
  payment_term_id: number | null;

  @Column("integer", { name: "applicant_type_id", nullable: true })
  applicant_type_id: number | null;

  @Column("character varying", {
    name: "resident_status",
    nullable: true,
    length: 50,
  })
  resident_status: string | null;

  @Column("character varying", {
    name: "pan_number",
    nullable: true,
    length: 20,
  })
  pan_number: string | null;

  @Column("character varying", {
    name: "gst_number",
    nullable: true,
    length: 20,
  })
  gst_number: string | null;

  @Column("character varying", {
    name: "country_code",
    nullable: true,
    length: 10,
  })
  country_code: string | null;

  @Column("character varying", {
    name: "vendor_type",
    nullable: true,
    length: 50,
  })
  vendor_type: string | null;

  @Column("boolean", { name: "is_msme", nullable: true, default: () => "false" })
  is_msme: boolean | null;

  @Column("character varying", { name: "address_line1", nullable: true, length: 255 })
  address_line1: string | null;

  @Column("character varying", { name: "address_line2", nullable: true, length: 255 })
  address_line2: string | null;

  @Column("character varying", { name: "address_line3", nullable: true, length: 255 })
  address_line3: string | null;

  @Column("character varying", { name: "state_code", nullable: true, length: 50 })
  state_code: string | null;

  @Column("character varying", { name: "city", nullable: true, length: 100 })
  city: string | null;

  @Column("character varying", { name: "pincode", nullable: true, length: 20 })
  pincode: string | null;

  @Column("integer", { name: "country_id", nullable: true })
  country_id: number | null;

  @Column("integer", { name: "currency_id", nullable: true })
  currency_id: number | null;

  @Column("character varying", { name: "contact_first_name", nullable: true, length: 100 })
  contact_first_name: string | null;

  @Column("character varying", { name: "contact_last_name", nullable: true, length: 100 })
  contact_last_name: string | null;

  @Column("character varying", { name: "contact_phone", nullable: true, length: 20 })
  contact_phone: string | null;

  @Column("character varying", { name: "contact_email", nullable: true, length: 100 })
  contact_email: string | null;

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

  @ManyToOne(() => VendorCategory, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "vendor_category_id", referencedColumnName: "id" }])
  vendor_category: VendorCategory | null;

  @ManyToOne(() => Tds, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "tds_id", referencedColumnName: "id" }])
  tds: Tds | null;

  @ManyToOne(() => PaymentTerm, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "payment_term_id", referencedColumnName: "id" }])
  payment_term: PaymentTerm | null;

  @ManyToOne(() => ApplicantType, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "applicant_type_id", referencedColumnName: "id" }])
  applicant_type: ApplicantType | null;
}
