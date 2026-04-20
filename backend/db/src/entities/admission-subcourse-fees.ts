import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lookups } from "./lookups";
import { Subcourses } from "./subcourses";

@Index("admission_subcourse_fees_pkey", ["id"], { unique: true })
@Entity("admission_subcourse_fees", { schema: "public" })
export class AdmissionSubcourseFees {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "fee_type_id"})
  fee_type_id: number

  @Column("integer", { name: "subcourse_id"})
  subcourse_id: number

  @Column("integer", { name: "admission_id"})
  admission_id: number

  @Column("integer", { name: "amount", nullable: true })
  amount: number | null;

  @Column("date", { name: "completed_date", nullable: true })
  completed_date: string | null;

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

  @ManyToOne(() => Lookups, (lookups) => lookups.admission_subcourse_fees)
  @JoinColumn([{ name: "fee_type_id", referencedColumnName: "id" }])
  fee_type: Lookups;

  @ManyToOne(
    () => Subcourses,
    (subcourses) => subcourses.admission_subcourse_fees
  )
  @JoinColumn([{ name: "subcourse_id", referencedColumnName: "id" }])
  subcourse: Subcourses;
}
