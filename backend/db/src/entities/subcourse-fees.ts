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

@Index("subcourse_fees_pkey", ["id"], { unique: true })
@Entity("subcourse_fees", { schema: "public" })
export class SubcourseFees {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "fee_type_id"})
  fee_type_id: number;

  @Column("integer", { name: "subcourse_id"})
  subcourse_id: number;

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

  @ManyToOne(() => Lookups, (lookups) => lookups.subcourse_fees)
  @JoinColumn([{ name: "fee_type_id", referencedColumnName: "id" }])
  fee_type: Lookups;

  @ManyToOne(() => Subcourses, (subcourses) => subcourses.subcourse_fees, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "subcourse_id", referencedColumnName: "id" }])
  subcourse: Subcourses;
}
