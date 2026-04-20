import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("app_banner_pkey", ["id"], { unique: true })
@Entity("app_banner", { schema: "public" })
export class AppBanner {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "front_banner",
    nullable: true,
    length: 100,
  })
  front_banner: string | null;

  @Column("character varying", {
    name: "created_by",
    nullable: true,
    length: 100,
  })
  created_by: string | null;

  @Column("timestamp without time zone", {
    name: "created_date",
    nullable: true,
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
  })
  updated_date: Date | null;
}
