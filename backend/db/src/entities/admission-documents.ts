import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Admissions } from "./admissions";

@Index("admission_documents_pkey", ["id"], { unique: true })
@Entity("admission_documents", { schema: "public" })
export class AdmissionDocuments {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "admission_id" })
  admission_id: number

  @Column("character varying", { name: "photos", nullable: true, length: 100 })
  photos: string | null;

  @Column("character varying", {
    name: "aadhar_card",
    nullable: true,
    length: 100,
  })
  aadhar_card: string | null;

  @Column("character varying", { name: "form", nullable: true, length: 100 })
  form: string | null;

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

  @Column("character varying", {
    name: "last_passing_marksheet",
    nullable: true,
    length: 100,
  })
  last_passing_marksheet: string | null;

  @ManyToOne(() => Admissions, (admissions) => admissions.admission_documents)
  @JoinColumn([{ name: "admission_id", referencedColumnName: "id" }])
  admission: Admissions;
}
