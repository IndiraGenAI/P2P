import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lookups } from "./lookups";
import { Packages } from "./packages";

@Index("admission_package_fees_pkey", ["id"], { unique: true })
@Entity("admission_package_fees", { schema: "public" })
export class AdmissionPackageFees {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "fee_type_id"})
  fee_type_id: number

  @Column("integer", { name: "admission_id"})
  admission_id: number

  @Column("integer", { name: "package_id"})
  package_id: number

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

  @ManyToOne(() => Lookups, (lookups) => lookups.admission_package_fees)
  @JoinColumn([{ name: "fee_type_id", referencedColumnName: "id" }])
  fee_type: Lookups;

  @ManyToOne(() => Packages, (packages) => packages.admission_package_fees)
  @JoinColumn([{ name: "package_id", referencedColumnName: "id" }])
  package: Packages;
}
