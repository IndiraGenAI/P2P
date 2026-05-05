import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Currency } from "./currency";
import { Department } from "./department";
import { EntityMaster } from "./entity-master";
import { ItemType } from "./item-type";
import { PaymentTerm } from "./payment-term";
import { Subdepartment } from "./subdepartment";
import { TermsCondition } from "./terms-condition";
import { Vendor } from "./vendor";
import { VendorSite } from "./vendor-site";

@Index("rate_contracts_pkey", ["id"], { unique: true })
@Index("rate_contracts_rc_number_key", ["rc_number"], { unique: true })
@Entity("rate_contracts", { schema: "public" })
export class RateContract {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "rc_number",
    nullable: true,
    length: 50,
  })
  rc_number: string | null;

  @Column("integer", { name: "entity_id", nullable: true })
  entity_id: number | null;

  @Column("integer", { name: "vendor_id", nullable: true })
  vendor_id: number | null;

  @Column("integer", { name: "vendor_site_id", nullable: true })
  vendor_site_id: number | null;

  @Column("integer", { name: "shipping_vendor_site_id", nullable: true })
  shipping_vendor_site_id: number | null;

  @Column("integer", { name: "billing_vendor_site_id", nullable: true })
  billing_vendor_site_id: number | null;

  @Column("text", { name: "shipping_address", nullable: true })
  shipping_address: string | null;

  @Column("text", { name: "billing_address", nullable: true })
  billing_address: string | null;

  @Column("integer", { name: "currency_id", nullable: true })
  currency_id: number | null;

  @Column("integer", { name: "item_type_id", nullable: true })
  item_type_id: number | null;

  @Column("date", { name: "validity_from", nullable: true })
  validity_from: Date | null;

  @Column("date", { name: "validity_to", nullable: true })
  validity_to: Date | null;

  @Column("date", { name: "required_date", nullable: true })
  required_date: Date | null;

  @Column("character varying", {
    name: "frequency",
    nullable: true,
    length: 50,
  })
  frequency: string | null;

  @Column("integer", { name: "department_id", nullable: true })
  department_id: number | null;

  @Column("integer", { name: "subdepartment_id", nullable: true })
  subdepartment_id: number | null;

  @Column("integer", { name: "payment_term_id", nullable: true })
  payment_term_id: number | null;

  @Column("integer", { name: "terms_condition_id", nullable: true })
  terms_condition_id: number | null;

  @Column("text", { name: "overall_summary", nullable: true })
  overall_summary: string | null;

  @Column("numeric", {
    name: "total_base_amount",
    nullable: true,
    precision: 12,
    scale: 2,
    default: () => "0",
  })
  total_base_amount: string | null;

  @Column("numeric", {
    name: "net_amount",
    nullable: true,
    precision: 12,
    scale: 2,
    default: () => "0",
  })
  net_amount: string | null;

  @Column("character varying", {
    name: "status",
    nullable: true,
    length: 50,
    default: () => "'DRAFT'",
  })
  status: string | null;

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

  @ManyToOne(() => EntityMaster, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "entity_id", referencedColumnName: "id" }])
  entity: EntityMaster | null;

  @ManyToOne(() => Vendor, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "vendor_id", referencedColumnName: "id" }])
  vendor: Vendor | null;

  @ManyToOne(() => VendorSite, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "vendor_site_id", referencedColumnName: "id" }])
  vendor_site: VendorSite | null;

  @ManyToOne(() => VendorSite, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "shipping_vendor_site_id", referencedColumnName: "id" }])
  shipping_vendor_site: VendorSite | null;

  @ManyToOne(() => VendorSite, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "billing_vendor_site_id", referencedColumnName: "id" }])
  billing_vendor_site: VendorSite | null;

  @ManyToOne(() => Currency, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "currency_id", referencedColumnName: "id" }])
  currency: Currency | null;

  @ManyToOne(() => ItemType, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "item_type_id", referencedColumnName: "id" }])
  item_type: ItemType | null;

  @ManyToOne(() => Department, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "department_id", referencedColumnName: "id" }])
  department: Department | null;

  @ManyToOne(() => Subdepartment, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "subdepartment_id", referencedColumnName: "id" }])
  subdepartment: Subdepartment | null;

  @ManyToOne(() => PaymentTerm, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "payment_term_id", referencedColumnName: "id" }])
  payment_term: PaymentTerm | null;

  @ManyToOne(() => TermsCondition, { onDelete: "RESTRICT", nullable: true })
  @JoinColumn([{ name: "terms_condition_id", referencedColumnName: "id" }])
  terms_condition: TermsCondition | null;
}
