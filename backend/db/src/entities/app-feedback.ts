import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("app_feedback_pkey", ["id"], { unique: true })
@Entity("app_feedback", { schema: "public" })
export class AppFeedback {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("enum", {
    name: "subject",
    nullable: true,
    enum: ["STUDENT", "OTHER"],
  })
  subject: "STUDENT" | "OTHER" | null;

  @Column("character varying", { name: "type", nullable: true, length: 100 })
  type: string | null;

  @Column("character varying", { name: "remarks", nullable: true, length: 100 })
  remarks: string | null;

  @Column("enum", {
    name: "feedback_type",
    nullable: true,
    enum: ["STUDENT", "PARENTS"],
  })
  feedback_type: "STUDENT" | "PARENTS" | null;

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
}
