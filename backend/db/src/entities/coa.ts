import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CoaCategory } from "./coa-category";

@Index("coa_pkey", ["id"], { unique: true })
@Index("coa_gl_code_key", ["gl_code"], { unique: true })
@Index("coa_gl_name_key", ["gl_name"], { unique: true })
@Entity("coa", { schema: "public" })
export class Coa {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "coa_category_id" })
  coa_category_id: number;

  @Column("character varying", { name: "gl_code", length: 50 })
  gl_code: string;

  @Column("character varying", { name: "gl_name", length: 150 })
  gl_name: string;

  @Column("character varying", {
    name: "distribution_combination",
    length: 255,
  })
  distribution_combination: string;

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

  @ManyToOne(() => CoaCategory, { onDelete: "RESTRICT" })
  @JoinColumn([{ name: "coa_category_id", referencedColumnName: "id" }])
  coa_category: CoaCategory;
}
