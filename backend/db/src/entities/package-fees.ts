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

@Index("package_fees_pkey", ["id"], { unique: true })
@Entity("package_fees", { schema: "public" })
export class PackageFees {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "fee_type_id"})
  fee_type_id: number;

  @Column("integer", { name: "package_id"})
  package_id: number;

  @Column("integer", { name: "amount", nullable: true })
  amount: number | null;

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

  @ManyToOne(() => Lookups, (lookups) => lookups.package_fees)
  @JoinColumn([{ name: "fee_type_id", referencedColumnName: "id" }])
  fee_type: Lookups;

  @ManyToOne(() => Packages, (packages) => packages.package_fees, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "package_id", referencedColumnName: "id" }])
  package: Packages;
}
