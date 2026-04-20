import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AdmissionFees } from "./admission-fees";
import { AdmissionPackageFees } from "./admission-package-fees";
import { AdmissionSubcourseFees } from "./admission-subcourse-fees";
import { InvoiceFees } from "./invoice-fees";
import { PackageFees } from "./package-fees";
import { SubcourseFees } from "./subcourse-fees";

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

  @OneToMany(
    () => AdmissionPackageFees,
    (admission_package_fees) => admission_package_fees.fee_type
  )
  admission_package_fees: AdmissionPackageFees[];

  @OneToMany(
    () => AdmissionSubcourseFees,
    (admission_subcourse_fees) => admission_subcourse_fees.fee_type
  )
  admission_subcourse_fees: AdmissionSubcourseFees[];

  @OneToMany(() => PackageFees, (package_fees) => package_fees.fee_type)
  package_fees: PackageFees[];

  @OneToMany(() => SubcourseFees, (subcourse_fees) => subcourse_fees.fee_type)
  subcourse_fees: SubcourseFees[];

  @OneToMany(() => InvoiceFees, (invoice_fees) => invoice_fees.fee_type)
  invoice_fees: InvoiceFees[];

  @OneToMany(() => AdmissionFees, (admission_fees) => admission_fees.fee_type)
  admission_fees: AdmissionFees[];

}
