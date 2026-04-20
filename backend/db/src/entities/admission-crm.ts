import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Admissions } from "./admissions";

@Index("admission_crm_pkey", ["id"], { unique: true })
@Entity("admission_crm", { schema: "public" })
export class AdmissionCrm {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column('integer', { name: 'admission_id' })
  admission_id: number;

  @Column("integer", { name: "lead_id", nullable: true })
  lead_id: number | null;

  @Column("text", { name: "lead_details", nullable: true })
  lead_details: string | null;

  @Column("text", { name: "history", nullable: true })
  history: string | null;

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

  @ManyToOne(
    () => Admissions,
    (admissions) => admissions.admissioncrm,
  )
  @JoinColumn([{ name: 'admission_id', referencedColumnName: 'id' }])
  admission: Admissions;
}
