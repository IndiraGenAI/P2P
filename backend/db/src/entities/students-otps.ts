import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("students_otps_pkey", ["id"], { unique: true })
@Entity("students_otps", { schema: "public" })
export class StudentsOtps {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "mobile_no", length: 10 })
  mobile_no: string;

  @Column("character varying", { name: "code", length: 6 })
  code: string;

  @Column("timestamp without time zone", {
    name: "expire_date",
    nullable: true,
  })
  expire_date: Date | null;

  @Column("timestamp without time zone", {
    name: "created_date",
    nullable: true,
  })
  created_date: Date | null;
}
