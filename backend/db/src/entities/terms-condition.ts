import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("terms_and_conditions_pkey", ["id"], { unique: true })
@Index("terms_and_conditions_code_key", ["code"], { unique: true })
@Index("terms_and_conditions_name_key", ["name"], { unique: true })
@Entity("terms_and_conditions", { schema: "public" })
export class TermsCondition {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "code", length: 50 })
  code: string;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

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
