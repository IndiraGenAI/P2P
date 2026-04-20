import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("student_mpin_pkey", ["id"], { unique: true })
@Index("student_mpin_mobile_no_key", ["mobile_no"], { unique: true })
@Entity("student_mpin", { schema: "public" })
export class StudentMpin {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "mobile_no", unique: true, length: 15 })
  mobile_no: string;

  @Column("character varying", { name: "mpin", length: 255 })
  mpin: string;

  @Column("timestamp without time zone", {
    name: "created_date",
    nullable: true,
  })
  created_date: Date | null;

  @Column("character varying", {
    name: "created_by",
    nullable: true,
    length: 100,
  })
  created_by: string | null;

  @Column("timestamp without time zone", {
    name: "updated_date",
    nullable: true,
  })
  updated_date: Date | null;

  @Column("character varying", {
    name: "updated_by",
    nullable: true,
    length: 100,
  })
  updated_by: string | null;
}
