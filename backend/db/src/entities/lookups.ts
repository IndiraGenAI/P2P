import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("lookups_pkey", ["id"], { unique: true })
@Entity("lookups", { schema: "public" })
export class Lookups {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("character varying", { name: "type", nullable: true, length: 100 })
  type: string | null;

  @Column("character varying", { name: "code", nullable: true, length: 100 })
  code: string | null;

  @Column("character varying", { name: "color", nullable: true, length: 100 })
  color: string | null;

  @Column("boolean", { name: "default_search", default: () => "true" })
  default_search: boolean;

  @Column("boolean", { name: "active", default: () => "true" })
  active: boolean;

  @Column("integer", { name: "orderby", nullable: true })
  orderby: number | null;
}
