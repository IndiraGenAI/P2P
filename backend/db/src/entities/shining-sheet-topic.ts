import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Subcourses } from "./subcourses";

@Index("shining_sheet_topic_pkey", ["id"], { unique: true })
@Entity("shining_sheet_topic", { schema: "public" })
export class ShiningSheetTopic {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "subcourse_id"})
  subcourse_id: number;

  @Column("character varying", { name: "name", nullable: true, length: 100 })
  name: string | null;

  @Column("integer", { name: "num_of_project", nullable: true })
  num_of_project: number | null;

  @Column("numeric", { name: "marks", nullable: true, precision: 5, scale: 2 })
  marks: number | null;

  @Column("numeric", {
    name: "duration",
    nullable: true,
    precision: 5,
    scale: 2,
  })
  duration: number | null;

  @Column("boolean", { name: "status", nullable: true, default: () => "true" })
  status: boolean | null;

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

  @ManyToOne(() => Subcourses, (subcourses) => subcourses.shining_sheet_topics)
  @JoinColumn([{ name: "subcourse_id", referencedColumnName: "id" }])
  subcourse: Subcourses;
}
