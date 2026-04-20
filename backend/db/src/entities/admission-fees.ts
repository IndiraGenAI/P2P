import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Admissions } from "./admissions";
import { Lookups } from "./lookups";

@Index("admission_fees_pkey", ["id"], { unique: true })
@Entity("admission_fees", { schema: "public" })
export class AdmissionFees {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "admission_id"})
  admission_id: number

  @Column("integer", { name: "fee_type_id"})
  fee_type_id: number

  @Column("numeric", {
    name: "amount",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => 0,
  })
  amount: number | null;

  @Column("numeric", {
    name: "paid_amount",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => 0,
  })
  paid_amount: number | null;

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

  @ManyToOne(() => Admissions, (admissions) => admissions.admission_fees)
  @JoinColumn([{ name: "admission_id", referencedColumnName: "id" }])
  admission: Admissions;

  @ManyToOne(() => Lookups, (lookups) => lookups.admission_fees)
  @JoinColumn([{ name: "fee_type_id", referencedColumnName: "id" }])
  fee_type: Lookups;
}
