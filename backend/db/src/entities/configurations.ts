import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("configurations_code_key", ["code"], { unique: true })
@Index("configurations_pkey", ["id"], { unique: true })
@Entity("configurations", { schema: "public" })
export class Configurations {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("character varying", { name: "value", nullable: true, length: 255 })
  value: string | null;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 255,
  })
  description: string | null;

  @Column("character varying", {
    name: "code",
    nullable: true,
    unique: true,
    length: 100,
  })
  code: string | null;

  @Column("timestamp without time zone", {
    name: "modified_date",
    nullable: true,
  })
  modified_date: Date | null;

  @Column("integer", { name: "modified_by", nullable: true })
  modified_by: number | null;
}
