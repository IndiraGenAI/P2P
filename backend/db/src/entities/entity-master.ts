import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("entities_pkey", ["id"], { unique: true })
@Index("entities_code_key", ["code"], { unique: true })
@Index("entities_name_key", ["name"], { unique: true })
@Entity("entities", { schema: "public" })
export class EntityMaster {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "code", length: 50 })
  code: string;

  @Column("character varying", { name: "name", length: 150 })
  name: string;

  @Column("character varying", {
    name: "business_unit",
    nullable: true,
    length: 100,
  })
  business_unit: string | null;

  @Column("character varying", {
    name: "legal_entity",
    nullable: true,
    length: 150,
  })
  legal_entity: string | null;

  @Column("character varying", {
    name: "liability_distribution",
    nullable: true,
    length: 255,
  })
  liability_distribution: string | null;

  @Column("character varying", {
    name: "prepayment_distribution",
    nullable: true,
    length: 255,
  })
  prepayment_distribution: string | null;

  @Column("text", {
    name: "shipping_addresses",
    nullable: true,
    array: true,
  })
  shipping_addresses: string[] | null;

  @Column("text", {
    name: "billing_addresses",
    nullable: true,
    array: true,
  })
  billing_addresses: string[] | null;

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
}
